import chalk from "chalk"

export function printBenchmark(suite: any): void {
  console.log(`${chalk.bold.underline(`Benchmark: ${suite.name}`)}`)

  const items: any[] = []
  suite.forEach((item: any) => { items.push(item) })
  items.sort((a, b) => a.hz > b.hz ? -1 : a.hz < b.hz ? 1 : 0)

  const fastest = items[0]
  const slowest = items[items.length - 1]

  let len = 0
  items.forEach((item: any) => len = Math.max(len, item.name.length as number))

  items.forEach((item: any) => {
    let name = ""
    let comp = ""
    if (item.name === fastest.name) {
       name = chalk.bold.green(item.name.padEnd(len))
    } else if (item.name === slowest.name) {
      name = chalk.bold.red(item.name.padEnd(len))
      comp = ` (${fastest.name} is ${((fastest.hz / item.hz)).toFixed(2)} times faster)`
    } else {
      name = chalk.bold(item.name.padEnd(len))
      comp = ` (${fastest.name} is ${((fastest.hz / item.hz)).toFixed(2)} times faster)`
    }
    console.log(`  • ${name} ${item.hz.toFixed(0)} ops/sec${comp}`)
  })
}
