import {
  Node, Element, Text, Attr, NodeType, ProcessingInstruction, Comment,
  Document, DocumentType, CDATASection, HTMLElement
} from "../dom/interfaces"
import { namespace as infraNamespace } from "@oozcitak/infra"
import { create_attr, create_element, namespace_extractQName } from "../algorithm"
import { Guard } from "../util"

enum AbsoluteURLs { kDoNotResolveURLs, kResolveAllURLs, kResolveNonLocalURLs }
enum SerializationType { kHTML, kXML }
enum IncludeShadowRoots { kNoShadowRoots, kIncludeShadowRoots }
enum ChildrenOnly { kIncludeNode, kChildrenOnly }

enum EntityMask {
  kEntityAmp = 0x0001,
  kEntityLt = 0x0002,
  kEntityGt = 0x0004,
  kEntityQuot = 0x0008,
  kEntityNbsp = 0x0010,
  kEntityTab = 0x0020,
  kEntityLineFeed = 0x0040,
  kEntityCarriageReturn = 0x0080,

  // Non-breaking space needs to be escaped in innerHTML for compatibility
  // reasons. See http://trac.webkit.org/changeset/32879. However, we cannot do
  // this in an XML document because it does not have the entity reference
  // defined (see bug 19215).
  kEntityMaskInCDATA = 0,
  kEntityMaskInPCDATA = kEntityAmp | kEntityLt | kEntityGt,
  kEntityMaskInHTMLPCDATA = kEntityMaskInPCDATA | kEntityNbsp,
  kEntityMaskInAttributeValue =
  kEntityAmp | kEntityQuot | kEntityLt | kEntityGt | kEntityTab |
  kEntityLineFeed |
  kEntityCarriageReturn,
  kEntityMaskInHTMLAttributeValue = kEntityAmp | kEntityQuot | kEntityNbsp,
};

export function serializeToString(root: Node): string {
  const accumulator = new MarkupAccumulator(AbsoluteURLs.kDoNotResolveURLs, SerializationType.kXML, IncludeShadowRoots.kNoShadowRoots)
  return accumulator.SerializeNodes(root, ChildrenOnly.kIncludeNode)
}

function ElementCannotHaveEndTag(node: Node): boolean {
  //auto* html_element = DynamicTo<HTMLElement>(node);
  //if (!html_element) return false;

  //return !html_element->ShouldSerializeEndTag();
  return false
}

function EqualIgnoringNullity(a: string | null, b: string | null): boolean {
  if (a === null && b !== null && b.length === 0)
    return true
  if (b === null && a !== null && a.length === 0)
    return true
  return a === b
}

class MarkupAccumulator {

  private markup_ = { str: "" }
  private formatter_: MarkupFormatter

  private namespace_stack_: NamespaceContext[] = []

  // https://w3c.github.io/DOM-Parsing/#dfn-generated-namespace-prefix-index
  private prefix_index_: number = 1

  constructor(resolve_urls_method: AbsoluteURLs,
    serialization_type: SerializationType,
    private include_shadow_roots_: IncludeShadowRoots) {
    this.formatter_ = new MarkupFormatter(resolve_urls_method, serialization_type)
  }

  private AppendEndTag(element: Element, prefix: string | null): void {
    this.formatter_.AppendEndMarkup(this.markup_, element, prefix, element.localName)
  }

  private AppendStartMarkup(node: Node): void {
    if (Guard.isTextNode(node)) {
      this.formatter_.AppendText(this.markup_, node)
    } else if (Guard.isAttrNode(node)) {
      // Only XMLSerializer can pass an Attr.  So, |documentIsHTML| flag is
      // false.
      this.formatter_.AppendAttributeValue(this.markup_, node.value, false)
    } else {
      this.formatter_.AppendStartMarkup(this.markup_, node)
    }
  }

  private AppendCustomAttributes(): void { }

  private ShouldIgnoreAttribute(): boolean {
    return false
  }

  private ShouldIgnoreElement(): boolean {
    return false
  }

  private AppendElement(element: Element): string | null {
    const data = this.AppendStartTagOpen(element)
    if (this.SerializeAsHTML()) {
      // https://html.spec.whatwg.org/C/#html-fragment-serialisation-algorithm

      const attributes = element.attributes
      // 3.2. Element: If current node's is value is not null, and the
      // element does not have an is attribute in its attribute list, ...
      const is_value = element._is
      if (is_value !== null && attributes.getNamedItem("is") === undefined) {
        const isAttr = create_attr(element._nodeDocument, "is")
        isAttr.value = is_value
        this.AppendAttribute(element, isAttr)
      }
      for (const attribute of attributes) {
        if (!this.ShouldIgnoreAttribute())
          this.AppendAttribute(element, attribute)
      }
    } else {
      // https://w3c.github.io/DOM-Parsing/#xml-serializing-an-element-node

      for (const attribute of element.attributes) {
        if (data.ignore_namespace_definition_attribute_ &&
          attribute.namespaceURI == infraNamespace.XMLNS &&
          attribute.prefix === "") {
          // Drop xmlns= only if it's inconsistent with element's namespace.
          // https://github.com/w3c/DOM-Parsing/issues/47
          if (!EqualIgnoringNullity(attribute.value, element.namespaceURI))
            continue
        }
        if (!this.ShouldIgnoreAttribute())
          this.AppendAttribute(element, attribute)
      }
    }

    // Give an opportunity to subclasses to add their own attributes.
    this.AppendCustomAttributes()

    this.AppendStartTagClose(element)
    return data.serialized_prefix_
  }

  private AppendStartTagOpen(element: Element): ElementSerializationData {
    const data = new ElementSerializationData()
    data.serialized_prefix_ = element.prefix
    if (this.SerializeAsHTML()) {
      this.formatter_.AppendStartTagOpen(this.markup_, element)
      return data
    }

    // https://w3c.github.io/DOM-Parsing/#xml-serializing-an-element-node

    const namespace_context = this.namespace_stack_[this.namespace_stack_.length - 1]
    if (namespace_context === undefined) {
      throw new Error("namespace_context is undefined")
    }

    // 5. Let ignore namespace definition attribute be a boolean flag with value
    // false.
    data.ignore_namespace_definition_attribute_ = false
    // 8. Let local default namespace be the result of recording the namespace
    // information for node given map and local prefixes map.
    const local_default_namespace = namespace_context.RecordNamespaceInformation(element)
    // 9. Let inherited ns be a copy of namespace.
    const inherited_ns = namespace_context.ContextNamespace()
    // 10. Let ns be the value of node's namespaceURI attribute.
    const ns = element.namespaceURI

    // 11. If inherited ns is equal to ns, then:
    if (inherited_ns == ns) {
      // 11.1. If local default namespace is not null, then set ignore namespace
      // definition attribute to true.
      data.ignore_namespace_definition_attribute_ = local_default_namespace !== null
      // 11.3. Otherwise, append to qualified name the value of node's
      // localName. The node's prefix if it exists, is dropped.

      // 11.4. Append the value of qualified name to markup.
      this.formatter_.AppendStartTagOpen(this.markup_, null, element.localName)
      data.serialized_prefix_ = null
      return data
    }

    // 12. Otherwise, inherited ns is not equal to ns (the node's own namespace is
    // different from the context namespace of its parent). Run these sub-steps:
    // 12.1. Let prefix be the value of node's prefix attribute.
    let prefix = element.prefix
    // 12.2. Let candidate prefix be the result of retrieving a preferred prefix
    // string prefix from map given namespace ns.
    let candidate_prefix: string | null = null
    if (ns && (prefix || ns != local_default_namespace)) {
      candidate_prefix = this.RetrievePreferredPrefixString(ns, prefix)
    }
    // 12.4. if candidate prefix is not null (a namespace prefix is defined which
    // maps to ns), then:
    if (candidate_prefix !== null && this.LookupNamespaceURI(candidate_prefix)) {
      // 12.4.1. Append to qualified name the concatenation of candidate prefix,
      // ":" (U+003A COLON), and node's localName.
      // 12.4.3. Append the value of qualified name to markup.
      this.formatter_.AppendStartTagOpen(this.markup_, candidate_prefix, element.localName)
      data.serialized_prefix_ = candidate_prefix
      // 12.4.2. If the local default namespace is not null (there exists a
      // locally-defined default namespace declaration attribute) and its value is
      // not the XML namespace, then let inherited ns get the value of local
      // default namespace unless the local default namespace is the empty string
      // in which case let it get null (the context namespace is changed to the
      // declared default, rather than this node's own namespace).
      if (local_default_namespace != infraNamespace.XML) {
        namespace_context.InheritLocalDefaultNamespace(local_default_namespace)
      }
      return data
    }

    // 12.5. Otherwise, if prefix is not null, then:
    if (prefix) {
      // 12.5.1. If the local prefixes map contains a key matching prefix, then
      // let prefix be the result of generating a prefix providing as input map,
      // ns, and prefix index
      if (element.hasAttribute("xmlns:" + prefix)) {
        prefix = this.GeneratePrefix(ns)
      } else {
        // 12.5.2. Add prefix to map given namespace ns.
        this.AddPrefix(prefix, ns)
      }
      // 12.5.3. Append to qualified name the concatenation of prefix, ":" (U+003A
      // COLON), and node's localName.
      // 12.5.4. Append the value of qualified name to markup.
      this.formatter_.AppendStartTagOpen(this.markup_, prefix, element.localName)
      data.serialized_prefix_ = prefix
      // 12.5.5. Append the following to markup, in the order listed:
      this.formatter_.AppendAttribute(this.markup_, "xmlns", prefix, ns || "", false)
      // 12.5.5.7. If local default namespace is not null (there exists a
      // locally-defined default namespace declaration attribute), then let
      // inherited ns get the value of local default namespace unless the local
      // default namespace is the empty string in which case let it get null.
      namespace_context.InheritLocalDefaultNamespace(local_default_namespace)
      return data
    }

    // 12.6. Otherwise, if local default namespace is null, or local default
    // namespace is not null and its value is not equal to ns, then:
    if (local_default_namespace === null ||
      !EqualIgnoringNullity(local_default_namespace, ns)) {
      // 12.6.1. Set the ignore namespace definition attribute flag to true.
      data.ignore_namespace_definition_attribute_ = true
      // 12.6.3. Let the value of inherited ns be ns.
      namespace_context.SetContextNamespace(ns)
      // 12.6.4. Append the value of qualified name to markup.
      this.formatter_.AppendStartTagOpen(this.markup_, element)
      // 12.6.5. Append the following to markup, in the order listed:
      this.formatter_.AppendAttribute(this.markup_, null, "xmlns", ns || "", false)
      return data
    }

    // 12.7. Otherwise, the node has a local default namespace that matches
    // ns. Append to qualified name the value of node's localName, let the value
    // of inherited ns be ns, and append the value of qualified name to markup.
    console.assert(EqualIgnoringNullity(local_default_namespace, ns))
    namespace_context.SetContextNamespace(ns)
    this.formatter_.AppendStartTagOpen(this.markup_, element)
    return data
  }

  private AppendStartTagClose(element: Element): void {
    this.formatter_.AppendStartTagClose(this.markup_, element)
  }

  private AppendAttribute(element: Element, attribute: Attr): void {
    const value = this.formatter_.ResolveURLIfNeeded(element, attribute)
    if (this.SerializeAsHTML()) {
      this.formatter_.AppendAttributeAsHTML(this.markup_, attribute, value)
    } else {
      this.AppendAttributeAsXMLWithNamespace(attribute, value)
    }
  }

  private AppendAttributeAsXMLWithNamespace(attribute: Attr, value: string): void {
    // https://w3c.github.io/DOM-Parsing/#serializing-an-element-s-attributes

    // 3.3. Let attribute namespace be the value of attr's namespaceURI value.
    const attribute_namespace = attribute.namespaceURI

    // 3.4. Let candidate prefix be null.
    let candidate_prefix: string | null = null

    if (attribute_namespace === null) {
      this.formatter_.AppendAttribute(this.markup_, candidate_prefix, attribute.localName, value, false)
      return
    }
    // 3.5. If attribute namespace is not null, then run these sub-steps:

    // 3.5.1. Let candidate prefix be the result of retrieving a preferred
    // prefix string from map given namespace attribute namespace with preferred
    // prefix being attr's prefix value.
    candidate_prefix =
      this.RetrievePreferredPrefixString(attribute_namespace, attribute.prefix)

    // 3.5.2. If the value of attribute namespace is the XMLNS namespace, then
    // run these steps:
    if (attribute_namespace == infraNamespace.XMLNS) {
      if (!attribute.prefix && attribute.localName !== "xmlns")
        candidate_prefix = "xmlns"
    } else {
      // 3.5.3. Otherwise, the attribute namespace in not the XMLNS namespace.
      // Run these steps:
      if (this.ShouldAddNamespaceAttribute(attribute, candidate_prefix)) {
        if (!candidate_prefix || this.LookupNamespaceURI(candidate_prefix)) {
          // 3.5.3.1. Let candidate prefix be the result of generating a prefix
          // providing map, attribute namespace, and prefix index as input.
          candidate_prefix = this.GeneratePrefix(attribute_namespace)
          // 3.5.3.2. Append the following to result, in the order listed:
          this.formatter_.AppendAttribute(this.markup_, "xmlns",
            candidate_prefix, attribute_namespace,
            false)
        } else {
          this.AppendNamespace(candidate_prefix, attribute_namespace)
        }
      }
    }
    this.formatter_.AppendAttribute(this.markup_, candidate_prefix,
      attribute.localName, value, false)
  }

  private ShouldAddNamespaceAttribute(attribute: Attr, candidate_prefix: string | null): boolean {
    // xmlns and xmlns:prefix attributes should be handled by another branch in
    // AppendAttributeAsXMLWithNamespace().
    console.assert(attribute.namespaceURI !== infraNamespace.XMLNS)
    // Null namespace is checked earlier in AppendAttributeAsXMLWithNamespace().
    console.assert(attribute.namespaceURI)

    // Attributes without a prefix will need one generated for them, and an xmlns
    // attribute for that prefix.
    if (!candidate_prefix)
      return true

    return !EqualIgnoringNullity(this.LookupNamespaceURI(candidate_prefix),
      attribute.namespaceURI)
  }

  private AppendNamespace(prefix: string, namespace_uri: string): void {
    const found_uri = this.LookupNamespaceURI(prefix)
    if (!EqualIgnoringNullity(found_uri, namespace_uri)) {
      this.AddPrefix(prefix, namespace_uri)
      if (!prefix) {
        this.formatter_.AppendAttribute(this.markup_, null, "xmlns", namespace_uri, false)
      } else {
        this.formatter_.AppendAttribute(this.markup_, "xmlns", prefix, namespace_uri, false)
      }
    }
  }

  private PushNamespaces(): void {
    if (this.SerializeAsHTML())
      return
    console.assert(this.namespace_stack_.length > 0)
    // TODO(tkent): Avoid to copy the whole map.
    // We can't do |namespace_stack_.emplace_back(namespace_stack_.back())|
    // because back() returns a reference in the vector backing, and
    // emplace_back() can reallocate it.
    this.namespace_stack_.push(this.namespace_stack_[this.namespace_stack_.length - 1].Clone())
  }

  private PopNamespaces(): void {
    if (this.SerializeAsHTML())
      return
    this.namespace_stack_.pop()
  }

  // https://w3c.github.io/DOM-Parsing/#dfn-retrieving-a-preferred-prefix-string
  private RetrievePreferredPrefixString(ns: string, preferred_prefix: string | null): string | null {
    console.assert(ns)
    const ns_for_preferred = this.LookupNamespaceURI(preferred_prefix)
    // Preserve the prefix if the prefix is used in the scope and the namespace
    // for it is matches to the node's one.
    // This is equivalent to the following step in the specification:
    // 2.1. If prefix matches preferred prefix, then stop running these steps and
    // return prefix.
    if (preferred_prefix && ns_for_preferred !== null &&
      EqualIgnoringNullity(ns_for_preferred, ns))
      return preferred_prefix

    const candidate_list = this.namespace_stack_[this.namespace_stack_.length - 1].PrefixList(ns)
    // Get the last effective prefix.
    //
    // <el1 xmlns:p="U1" xmlns:q="U1">
    //   <el2 xmlns:q="U2">
    //    el2.setAttributeNS(U1, 'n', 'v');
    // We should get 'p'.
    //
    // <el1 xmlns="U1">
    //  el1.setAttributeNS(U1, 'n', 'v');
    // We should not get '' for attributes.
    for (const candidate_prefix of candidate_list) {
      console.assert(candidate_prefix)
      const ns_for_candidate = this.LookupNamespaceURI(candidate_prefix)
      if (EqualIgnoringNullity(ns_for_candidate, ns))
        return candidate_prefix
    }

    // No prefixes for |ns|.
    // Preserve the prefix if the prefix is not used in the current scope.
    if (preferred_prefix && ns_for_preferred === null)
      return preferred_prefix
    // If a prefix is not specified, or the prefix is mapped to a
    // different namespace, we should generate new prefix.
    return null
  }

  private AddPrefix(prefix: string, namespace_uri: string | null): void {
    this.namespace_stack_[this.namespace_stack_.length - 1].Add(prefix, namespace_uri)
  }

  private LookupNamespaceURI(prefix: string | null): string {
    return this.namespace_stack_[this.namespace_stack_.length - 1].LookupNamespaceURI(prefix)
  }

  // https://w3c.github.io/DOM-Parsing/#dfn-generating-a-prefix
  private GeneratePrefix(new_namespace: string | null): string {
    let generated_prefix: string = ""
    do {
      // 1. Let generated prefix be the concatenation of the string "ns" and the
      // current numerical value of prefix index.
      generated_prefix = "ns" + this.prefix_index_.toString()
      // 2. Let the value of prefix index be incremented by one.
      this.prefix_index_++
    } while (this.LookupNamespaceURI(generated_prefix))
    // 3. Add to map the generated prefix given the new namespace namespace.
    this.AddPrefix(generated_prefix, new_namespace)
    // 4. Return the value of generated prefix.
    return generated_prefix
  }

  private SerializeAsHTML(): boolean {
    return this.formatter_.SerializeAsHTML()
  }

  private GetAuxiliaryDOMTree(element: Element): [Node | null, Element | null] {
    const shadow_root = element._shadowRoot
    if (!shadow_root || this.include_shadow_roots_ != IncludeShadowRoots.kIncludeShadowRoots)
      return [null, null]
    const shadowroot_type = shadow_root._mode
    // Wrap the shadowroot into a declarative Shadow DOM <template shadowroot>
    // element.
    const template_element = create_element(element._nodeDocument, "template", null, null)
    template_element.setAttribute("shadowroot", shadowroot_type)
    return [shadow_root, template_element]
  }

  private SerializeNodesWithNamespaces(target_node: Node, children_only: ChildrenOnly) {
    if (!Guard.isElementNode(target_node)) {
      if (!children_only) this.AppendStartMarkup(target_node)
      for (const child of target_node._children) {
        this.SerializeNodesWithNamespaces(child, ChildrenOnly.kIncludeNode)
      }
      return
    }

    const target_element = target_node
    if (this.ShouldIgnoreElement())
      return

    this.PushNamespaces()

    let prefix_override: string | null = null
    if (!children_only)
      prefix_override = this.AppendElement(target_element)

    const has_end_tag = !(this.SerializeAsHTML() && ElementCannotHaveEndTag(target_element))
    if (has_end_tag) {
      const parent = target_element
      // if (auto * template_element = DynamicTo<HTMLTemplateElement>(target_element))
      // parent = template_element -> content()
      for (const child of parent._children) {
        this.SerializeNodesWithNamespaces(child, ChildrenOnly.kIncludeNode)
      }

      // Traverses other DOM tree, i.e., shadow tree.
      const [auxiliary_tree, enclosing_element] = this.GetAuxiliaryDOMTree(target_element)
      if (auxiliary_tree) {
        let enclosing_element_prefix: string | null = null
        if (enclosing_element) {
          enclosing_element_prefix = this.AppendElement(enclosing_element)
        }
        for (const child of auxiliary_tree._children) {
          this.SerializeNodesWithNamespaces(child, ChildrenOnly.kIncludeNode)
        }
        if (enclosing_element) {
          this.AppendEndTag(enclosing_element, enclosing_element_prefix)
        }
      }

      if (!children_only) {
        this.AppendEndTag(target_element, prefix_override)
      }
    }

    this.PopNamespaces()
  }

  SerializeNodes(target_node: Node, children_only: ChildrenOnly): string {
    if (!this.SerializeAsHTML()) {
      // https://w3c.github.io/DOM-Parsing/#dfn-xml-serialization
      // 2. Let prefix map be a new namespace prefix map.
      this.namespace_stack_ = []
      this.namespace_stack_.push(new NamespaceContext())
      // 3. Add the XML namespace with prefix value "xml" to prefix map.
      this.AddPrefix("xml", infraNamespace.XML)
      // 4. Let prefix index be a generated namespace prefix index with value 1.
      this.prefix_index_ = 1
    }

    this.SerializeNodesWithNamespaces(target_node, children_only)
    return this.ToString()
  }

  ToString(): string { return this.markup_.str }

}

class NamespaceContext {

  private prefix_ns_map_ = new Map<string, string>()

  // Map a namespace URI to a list of prefixes.
  // https://w3c.github.io/DOM-Parsing/#the-namespace-prefix-map
  private ns_prefixes_map_ = new Map<string, string[]>()

  // https://w3c.github.io/DOM-Parsing/#dfn-context-namespace
  private context_namespace_: string | null = null

  // https://w3c.github.io/DOM-Parsing/#dfn-add
  //
  // This function doesn't accept empty prefix and empty namespace URI.
  //  - The default namespace is managed separately.
  //  - Namespace URI never be empty if the prefix is not empty.
  Add(prefix: string | null, namespace_uri: string | null): void {
    if (prefix === null) throw new Error("prefix should not be empty.")
    if (namespace_uri === null) throw new Error("namespace_uri should not be empty.")
    this.prefix_ns_map_.set(prefix, namespace_uri)
    this.ns_prefixes_map_.set(namespace_uri, [prefix])
  }

  // https://w3c.github.io/DOM-Parsing/#dfn-recording-the-namespace-information
  RecordNamespaceInformation(element: Element): string {
    let local_default_namespace = ""
    // 2. For each attribute attr in element's attributes, in the order they are
    // specified in the element's attribute list:
    for (const attr of element.attributes) {
      // We don't check xmlns namespace of attr here because xmlns attributes in
      // HTML documents don't have namespace URI. Some web tests serialize
      // HTML documents with XMLSerializer, and Firefox has the same behavior.
      if (attr.prefix === "" && attr.localName === "xmlns") {
        // 3.1. If attribute prefix is null, then attr is a default namespace
        // declaration. Set the default namespace attr value to attr's value
        // and stop running these steps, returning to Main to visit the next
        // attribute.
        local_default_namespace = attr.value
      } else if (attr.prefix == "xmlns") {
        this.Add(attr.prefix ? attr.localName : "", attr.value)
      }
    }
    // 3. Return the value of default namespace attr value.
    return local_default_namespace
  }

  LookupNamespaceURI(prefix: string | null): string {
    if (prefix === null) return ""
    return this.prefix_ns_map_.get(prefix) || ""
  }

  ContextNamespace(): string | null { return this.context_namespace_ }
  SetContextNamespace(context_ns: string | null): void {
    this.context_namespace_ = context_ns
  }

  InheritLocalDefaultNamespace(local_default_namespace: string): void {
    if (!local_default_namespace) {
      return
    }
    this.SetContextNamespace(local_default_namespace === "" ?
      null : local_default_namespace)
  }

  PrefixList(ns: string | null): string[] {
    return this.ns_prefixes_map_.get(ns ? ns : "") || []
  }

  Clone(): NamespaceContext {
    const clone = new NamespaceContext()
    for (const [key, val] of this.prefix_ns_map_) {
      clone.prefix_ns_map_.set(key, val)
    }
    for (const [key, val] of this.ns_prefixes_map_) {
      clone.ns_prefixes_map_.set(key, val.slice())
    }
    clone.context_namespace_ = this.context_namespace_

    return clone
  }
}

// This stores values used to serialize an element. The values are not
// inherited to child node serialization.
class ElementSerializationData {
  // https://w3c.github.io/DOM-Parsing/#dfn-ignore-namespace-definition-attribute
  ignore_namespace_definition_attribute_ = false

  serialized_prefix_: string | null = null
}

class MarkupFormatter {
  constructor(private resolve_urls_method_: AbsoluteURLs,
    private serialization_type_: SerializationType) { }

  SerializeAsHTML(): boolean {
    return this.serialization_type_ == SerializationType.kHTML
  }

  ResolveURLIfNeeded(element: Element, attribute: Attr): string {
    const value = attribute.value
    /*
    switch (this.resolve_urls_method_) {
      case AbsoluteURLs.kResolveAllURLs:
        if (element.IsURLAttribute(attribute))
          return element.GetDocument().CompleteURL(value).GetString()
        break

      case AbsoluteURLs.kResolveNonLocalURLs:
        if (element.IsURLAttribute(attribute) &&
          !element.GetDocument().Url().IsLocalFile())
          return element.GetDocument().CompleteURL(value).GetString()
        break

      case AbsoluteURLs.kDoNotResolveURLs:
        break
    }
    */
    return value
  }

  EntityMaskForText(text: Text): EntityMask {
    if (!this.SerializeAsHTML()) {
      return EntityMask.kEntityMaskInPCDATA
    }

    /**
    // TODO(hajimehoshi): We need to switch EditingStrategy.
    parent_name = text.parentElement?._qualifiedName
  
    if (parent_name === "script" ||
         parent_name === "style" ||
         parent_name === "xmp" ||
         parent_name === "iframe" ||
         parent_name === "plaintext" ||
         parent_name === "noembed" ||
         parent_name === "noframes" ||
         (parent_name === "noscript" &&
          text.GetDocument().GetFrame() &&
          text.GetDocument().CanExecuteScripts(kNotAboutToExecuteScript))))
      return kEntityMaskInCDATA;
    */
    return EntityMask.kEntityMaskInHTMLPCDATA
  }

  AppendAttribute(result: { str: string }, prefix: string | null, local_name: string, value: string, document_is_html: boolean): void {
    result.str += ' '
    if (prefix) {
      result.str += prefix
      result.str += ':'
    }
    result.str += local_name
    result.str += "=\""
    this.AppendAttributeValue(result, value, document_is_html)
    result.str += '"'
  }

  AppendAttributeAsHTML(result: { str: string }, attribute: Attr, value: string): void {
    // https://html.spec.whatwg.org/C/#attribute's-serialised-name
    let [prefix, localName] = namespace_extractQName(attribute._qualifiedName)
    if (attribute.namespaceURI === infraNamespace.XMLNS) {
      if (!prefix && localName !== "xmlns")
        prefix = "xmlns"
    } else if (attribute.namespaceURI === infraNamespace.XML) {
      prefix = "xml"
    } else if (attribute.namespaceURI === infraNamespace.XLink) {
      prefix = "xlink"
    }
    this.AppendAttribute(result, prefix, localName, value, true)
  }

  AppendAttributeAsXMLWithoutNamespace(result: { str: string }, attribute: Attr, value: string): void {
    const attribute_namespace = attribute.namespaceURI
    let candidate_prefix = attribute.prefix
    if (attribute_namespace === infraNamespace.XMLNS) {
      if (!attribute.prefix && attribute.localName != "xmlns")
        candidate_prefix = "xmlns"
    } else if (attribute_namespace === infraNamespace.XML) {
      if (!candidate_prefix)
        candidate_prefix = "xml"
    } else if (attribute_namespace == infraNamespace.XLink) {
      if (!candidate_prefix)
        candidate_prefix = "xlink"
    }

    this.AppendAttribute(result, candidate_prefix, attribute.localName, value, false)
  }

  AppendAttributeValue(result: { str: string }, attribute: string, document_is_html: boolean): void {
    this.AppendCharactersReplacingEntities(result, attribute, 0, attribute.length,
      document_is_html ? EntityMask.kEntityMaskInHTMLAttributeValue : EntityMask.kEntityMaskInAttributeValue)
  }

  AppendStartMarkup(result: { str: string }, node: Node): void {
    switch (node.nodeType) {
      case NodeType.Text:
        break
      case NodeType.Comment:
        this.AppendComment(result, (node as Comment).data)
        break
      case NodeType.Document:
        this.AppendXMLDeclaration(result, (node as Document))
        break
      case NodeType.DocumentFragment:
        break
      case NodeType.DocumentType:
        this.AppendDocumentType(result, (node as DocumentType))
        break
      case NodeType.ProcessingInstruction:
        this.AppendProcessingInstruction(result, (node as ProcessingInstruction).target, (node as ProcessingInstruction).data)
        break
      case NodeType.Element:
        break
      case NodeType.CData:
        this.AppendCDATASection(result, (node as CDATASection).data)
        break
      case NodeType.Attribute:
        break
    }
  }

  AppendEndMarkup(result: { str: string }, element: Element, prefix = element.prefix, local_name = element.localName): void {
    if (this.ShouldSelfClose(element) || (!element.hasChildNodes() && ElementCannotHaveEndTag(element))) {
      return
    }

    result.str += "</"
    if (prefix) {
      result.str += prefix + ':'
    }
    result.str += local_name + '>'
  }

  AppendStartTagOpen(result: { str: string }, elementOrPrefix: Element | string | null, local_name?: string): void {
    const prefix = Guard.isElementNode(elementOrPrefix) ? elementOrPrefix.prefix : elementOrPrefix
    const localName = Guard.isElementNode(elementOrPrefix) ? elementOrPrefix.localName : (local_name || "")
    result.str += '<'
    if (prefix) {
      result.str += prefix
      result.str += ":"
    }
    result.str += localName
  }

  AppendStartTagClose(result: { str: string }, element: Element): void {
    if (this.ShouldSelfClose(element)) {
      //if (element.IsHTMLElement())
      //  result.Append(' ')  // XHTML 1.0 <-> HTML compatibility.
      result.str += '/'
    }
    result.str += '>'
  }

  AppendText(result: { str: string }, text: Text): void {
    const str = text.data
    this.AppendCharactersReplacingEntities(result, str, 0, str.length, this.EntityMaskForText(text))
  }

  AppendComment(result: { str: string }, comment: string): void {
    // FIXME: Comment content is not escaped, but XMLSerializer (and possibly
    // other callers) should raise an exception if it includes "-->".
    result.str += "<!--" + comment + "-->"
  }

  AppendXMLDeclaration(result: { str: string }, document: Document): void {
    /*
    if (!document.HasXMLDeclaration())
      return
  
    result.Append("<?xml version=\"")
    result.Append(document.xmlVersion())
    const String& encoding = document.xmlEncoding()
    if (!encoding.IsEmpty()) {
      result.Append("\" encoding=\"")
      result.Append(encoding)
    }
    if (document.XmlStandaloneStatus() != Document:: kStandaloneUnspecified) {
      result.Append("\" standalone=\"")
      if (document.xmlStandalone())
        result.Append("yes")
      else
        result.Append("no")
    }
  
    result.Append("\"?>")
    */
  }

  AppendDocumentType(result: { str: string }, n: DocumentType): void {
    if (!n.name)
      return

    result.str += "<!DOCTYPE " + n.name
    if (n.publicId) {
      result.str += " PUBLIC \"" + n.publicId + "\""
      if (n.systemId) {
        result.str += " \"" + n.systemId + "\""
      }
    } else if (n.systemId) {
      result.str += " SYSTEM \"" + n.systemId + "\""
    }
    result.str += ">"
  }

  AppendProcessingInstruction(result: { str: string }, target: string, data: string): void {
    // FIXME: PI data is not escaped, but XMLSerializer (and possibly other
    // callers) this should raise an exception if it includes "?>".
    result.str += "<?" + target + ' ' + data + "?>"
  }

  AppendCDATASection(result: { str: string }, section: string): void {
    // FIXME: CDATA content is not escaped, but XMLSerializer (and possibly other
    // callers) should raise an exception if it includes "]]>".
    result.str += "<![CDATA[" + section + "]]>"
  }

  // Rules of self-closure
  // 1. No elements in HTML documents use the self-closing syntax.
  // 2. Elements w/ children never self-close because they use a separate end tag.
  // 3. HTML elements which do not listed in spec will close with a
  // separate end tag.
  // 4. Other elements self-close.
  ShouldSelfClose(element: Element): boolean {
    if (this.SerializeAsHTML())
      return false
    else if (element.hasChildNodes())
      return false
    else if (false && !ElementCannotHaveEndTag(element))
      return false
    else
      return true
  }

  AppendCharactersReplacingEntities(result: { str: string }, source: string, offset: number, length: number, entity_mask: EntityMask): void {
    /*
  DEFINE_STATIC_LOCAL(const std:: string, amp_reference, ("&amp;"));
  DEFINE_STATIC_LOCAL(const std:: string, lt_reference, ("&lt;"));
  DEFINE_STATIC_LOCAL(const std:: string, gt_reference, ("&gt;"));
  DEFINE_STATIC_LOCAL(const std:: string, quot_reference, ("&quot;"));
  DEFINE_STATIC_LOCAL(const std:: string, nbsp_reference, ("&nbsp;"));
  DEFINE_STATIC_LOCAL(const std:: string, tab_reference, ("&#9;"));
  DEFINE_STATIC_LOCAL(const std:: string, line_feed_reference, ("&#10;"));
  DEFINE_STATIC_LOCAL(const std:: string, carriage_return_reference, ("&#13;"));

  static const EntityDescription kEntityMaps[] = {
      { '&', amp_reference, kEntityAmp },
  { '<', lt_reference, kEntityLt },
  { '>', gt_reference, kEntityGt },
  { '"', quot_reference, kEntityQuot },
  { kNoBreakSpaceCharacter, nbsp_reference, kEntityNbsp },
  { '\t', tab_reference, kEntityTab },
  { '\n', line_feed_reference, kEntityLineFeed },
  { '\r', carriage_return_reference, kEntityCarriageReturn },
};
*/
    if (!(offset + length))
      return

    console.assert(offset + length <= source.length)

    /*
          StringBuilder& result,
    CharType* text,
    unsigned length,
    const EntityDescription entity_maps[],
    unsigned entity_maps_count,
    EntityMask entity_mask) {
  unsigned position_after_last_entity = 0;
  for (unsigned i = 0; i < length; ++i) {
    for (unsigned entity_index = 0; entity_index < entity_maps_count;
         ++entity_index) {
      if (text[i] == entity_maps[entity_index].entity &&
          entity_maps[entity_index].mask & entity_mask) {
        result.Append(text + position_after_last_entity,
                      i - position_after_last_entity);
        const std::string& replacement = entity_maps[entity_index].reference;
        result.Append(replacement.c_str(), replacement.length());
        position_after_last_entity = i + 1;
        break;
      }
    }
  }
  result.Append(text + position_after_last_entity,
                length - position_after_last_entity);
     */
    result.str += source
  }

}