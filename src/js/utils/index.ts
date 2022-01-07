const consoleLog = (data: any): void => {
  console.log('%c----------------GMAIL EXT----------------', 'color:green');
  console.log(data);
  console.log('%c----------------GMAIL EXT----------------', 'color:green');
};
const delay = (ms: number): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export { consoleLog, delay };
