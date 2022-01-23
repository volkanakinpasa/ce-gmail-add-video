const consoleLog = (data: any): void => {
  console.log('%c----------------GMAIL EXT----------------', 'color:green');
  console.log(data);
  console.log('%c----------------GMAIL EXT----------------', 'color:green');
};
const delay = (
  ms: number,
  cancellationToken: any = {},
): Promise<NodeJS.Timeout> => {
  return new Promise((resolve, reject) => {
    cancellationToken.cancel = function () {
      reject();
    };

    setTimeout(resolve, ms);
  });
};

export { consoleLog, delay };
