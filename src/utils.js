const removeUnwantedKeys = (object, keys = []) => {
    if (keys.length === 0) return object;
    if (typeof object !== "object") return object;
    return Object.keys(object).reduce((acc, key) => {
        if (!keys.find((k) => k === key)) {
            const typeo = typeof object[key];
            if (typeof object[key] == "object" && !Array.isArray(object[key])) {
                acc[key] = removeUnwantedKeys(object[key], keys);
            } else if (Array.isArray(object[key])) {
                acc[key] = object[key].map((k) => removeUnwantedKeys(k, keys))
            } else {
                acc[key] = object[key];
            }
            return acc;
        }
        return acc
    }, {});
}

exports.removeUnwantedKeys = removeUnwantedKeys;
