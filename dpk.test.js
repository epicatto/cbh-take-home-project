const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(typeof trivialKey).toBe("string");
    expect(trivialKey).toBe("0");
  });

  it("Returns the given partitionKey if it is present, is a string and its length is less or equals to 256", () => {
    const event = {
      partitionKey: "TEST_PARTITION_KEY",
    };
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBeDefined();
    expect(typeof trivialKey).toBe("string");
    expect(trivialKey).toBe(event.partitionKey);
  });

  it("Returns the given partitionKey (string) if it is present, is not a string and its length is less or equals to 256", () => {
    const event = {
      partitionKey: {
        prop4: 0,
        prop5: null,
      },
    };
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBeDefined();
    expect(typeof trivialKey).toBe("string");
    expect(trivialKey).toBe(JSON.stringify(event.partitionKey));
  });

  it("Returns the HASH of given partitionKey if it is present, but the value is 0", () => {
    const event = {
      partitionKey: 0,
    };
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBeDefined();
    expect(typeof trivialKey).toBe("string");
    expect(trivialKey).not.toBe(JSON.stringify(event.partitionKey));
  });

  it("Returns the HASH of given partitionKey if it is present, is a string and its length is greater than 256", () => {
    const event = {
      // 257 characters
      partitionKey:
          "uinxu7cypnwvr2paxvf1h6vtn02xyftneutdycvh2at20awgaxp5asib2pwjow6nkxdu1bx8hfrsr9cvmvvvxdfpa6wxcdditgpscowbh4jjdo73nfpeais8fgsv4mfjgqynkba0shyswror8dwghwrwbnpd7gvu4jysdmhkygfqtdxpadgiwvqixf3yfr2ehuoitvqdip7tydc1xhueqx9fzzwze3njy9ki8jqtfzz5esde9wsgaln8hsxqiuruf",
    };
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBeDefined();
    expect(typeof trivialKey).toBe("string");
    expect(trivialKey).not.toBe(event.partitionKey);
  });

  it("Returns the HASH of given partitionKey if it is present, is not a string and its length is greater than 256", () => {
    const event = {
      partitionKey: {
        // 257 characters
        prop4:
            "uinxu7cypnwvr2paxvf1h6vtn02xyftneutdycvh2at20awgaxp5asib2pwjow6nkxdu1bx8hfrsr9cvmvvvxdfpa6wxcdditgpscowbh4jjdo73nfpeais8fgsv4mfjgqynkba0shyswror8dwghwrwbnpd7gvu4jysdmhkygfqtdxpadgiwvqixf3yfr2ehuoitvqdip7tydc1xhueqx9fzzwze3njy9ki8jqtfzz5esde9wsgaln8hsxqiuruf",
        prop5: null,
      },
    };
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBeDefined();
    expect(typeof trivialKey).toBe("string");
    expect(trivialKey).not.toBe(event.partitionKey);
    expect(trivialKey).not.toBe(JSON.stringify(event.partitionKey));
  });

  it("Returns the HASH of given input if the partitionKey is not present", () => {
    const event = {
      prop1: "TEST_PROP1",
      prop2: true,
      prop3: {
        prop4: 0,
        prop5: null,
      },
    };
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBeDefined();
    expect(typeof trivialKey).toBe("string");
    expect(trivialKey.length).toBeLessThanOrEqual(256);
  });
});
