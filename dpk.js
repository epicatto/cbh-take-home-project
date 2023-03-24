const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

exports.deterministicPartitionKey = (event) => {
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  if (!event.partitionKey) {
    return createHash(JSON.stringify(event));
  }

  // We'll use the given partitionKey value
  const dataString =
    typeof event.partitionKey !== "string"
      ? JSON.stringify(event.partitionKey)
      : event.partitionKey;

  if (dataString.length > MAX_PARTITION_KEY_LENGTH) {
    return createHash(dataString);
  }
  return dataString;
};

createHash = (data) => {
  return crypto.createHash("sha3-512").update(data).digest("hex");
};
