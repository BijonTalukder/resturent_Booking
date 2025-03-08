const normalizeVariant = (variant) => {
  const modifiedKey = Object.keys(variant).reduce((acc, key) => {
    acc[key.toLowerCase()] = String(variant[key]).toLowerCase();
    return acc;
  }, {});
  return modifiedKey;
};

export const variantExists = (variants, newVariant) => {
  const normalizedNewVariant = normalizeVariant(newVariant);
  const exists = variants.some((variant) => {
    const normalizedVariant = normalizeVariant(variant);
    if (
      Object.keys(normalizedNewVariant).length >
      Object.keys(normalizedVariant).length
    ) {
      return Object.keys(normalizedNewVariant).every(
        (key) => normalizedVariant[key] === normalizedNewVariant[key]
      );
    } else if (
      Object.keys(normalizedNewVariant).length <
      Object.keys(normalizedVariant).length
    ) {
      return Object.keys(normalizedVariant).every(
        (key) => normalizedVariant[key] === normalizedNewVariant[key]
      );
    } else {
      return Object.keys(normalizedVariant).every(
        (key) => normalizedVariant[key] === normalizedNewVariant[key]
      );
    }
  });
  return exists;
};



