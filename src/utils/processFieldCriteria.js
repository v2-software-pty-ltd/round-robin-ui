export function processFieldCriteria(stringFieldCriteria) {
  /* field criteria is a JSON blob like:
  {
    "Lead_Source": "equals:Facebook,notequal:foo,Blah",
    "Lead_Status": "New Lead,Old Lead"
  }

  The old version involved manually typing the JSON out and was prone to error.

  We need to convert it into an array of objects like:
  [
    { fieldName: "Lead_Source", comparisonType: "equals", possibleValues: ["Facebook", "Blah"] },
    { fieldName: "Lead_Source", comparisonType: "notequal", possibleValues: ["foo"] },
    { fieldName: "Lead_Status", comparisonType: "equals", possibleValues: ["New Lead", "Old Lead"] },
  ]

  This data can be used to populate the UI
  */
  if (stringFieldCriteria) {
    try {
      const rawFieldCriteria = JSON.parse(stringFieldCriteria);
      const fields = Object.keys(rawFieldCriteria);
      const processedFieldCriteria = fields.reduce((result, rawFieldName) => {
        const fieldName = rawFieldName.trim();
        const criteriaForThisField = rawFieldCriteria[fieldName].split(",");

        criteriaForThisField.forEach(criterion => {
          const criterionParts = criterion.split(":");
          if (criterionParts.length > 1) {
            const comparisonType = criterionParts[0].trim();
            const expectedValue = criterionParts[1].trim();
            const resultKey = `${fieldName}::${comparisonType}`;
            if (!result[resultKey]) {
              result[resultKey] = [];
            }

            if (expectedValue.length > 0) {
              result[resultKey].push(expectedValue);
            }

          } else {
            const resultKey = `${fieldName}::equals`;
            if (!result[resultKey]) {
              result[resultKey] = [];
            }

            const processedCriterion = criterion.trim();

            if (processedCriterion.length > 0) {
              result[resultKey].push(processedCriterion);
            }
          }
        });

        return result;
      }, {});

      return Object.keys(processedFieldCriteria).reduce(
        (result, fieldCriterionKey) => {
          const criteriaParts = fieldCriterionKey.split("::");
          return result.concat({
            fieldName: criteriaParts[0],
            comparisonType: criteriaParts[1].trim(),
            possibleValues: processedFieldCriteria[fieldCriterionKey]
          });
        },
        []
      );
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  return [];
}

export function generateFieldCriteriaJSON(fieldCriteriaArray) {
  /*
  Convert:
  [
    { fieldName: "Lead_Source", comparisonType: "equals", possibleValues: ["Facebook", "Blah"] },
    { fieldName: "Lead_Source", comparisonType: "notequal", possibleValues: ["foo"] },
    { fieldName: "Lead_Status", comparisonType: "equals", possibleValues: ["New Lead", "Old Lead"] },
  ]

  back to
  {
    "Lead_Source": "equals:Facebook,notequal:foo,Blah",
    "Lead_Status": "New Lead,Old Lead"
  }
  */

  const fieldCriteriaObject = fieldCriteriaArray.reduce((result, fieldCriteriaRow) => {
    if (!result[fieldCriteriaRow.fieldName]) {
      result[fieldCriteriaRow.fieldName] = [];
    }

    const newRules = fieldCriteriaRow.possibleValues.map((possibleValue) => {
      return `${fieldCriteriaRow.comparisonType}:${possibleValue}`
    });

    result[fieldCriteriaRow.fieldName].push(newRules);
    return result;
  }, {});

  const fieldCriteriaJSON = Object.keys(fieldCriteriaObject).reduce((result, fieldName) => {
    result[fieldName] = fieldCriteriaObject[fieldName].join(',');
    return result;
  }, {});

  return JSON.stringify(fieldCriteriaJSON);
}
