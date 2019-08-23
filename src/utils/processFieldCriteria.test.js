import { generateFieldCriteriaJSON, processFieldCriteria } from "./processFieldCriteria";

describe('Process field criteria', () => {
  describe('Converting from JSON to array', () => {
    test("Example with mixed comparison operations", () => {
      const fieldCriteria = `{
      "Lead_Source": "equals:Facebook,notequal:foo,Blah",
      "Lead_Status": "New Lead,Old Lead"
    }`;

      const expectedResult = [
        {
          fieldName: "Lead_Source",
          comparisonType: "equals",
          possibleValues: ["Facebook", "Blah"]
        },
        {
          fieldName: "Lead_Source",
          comparisonType: "notequal",
          possibleValues: ["foo"]
        },
        {
          fieldName: "Lead_Status",
          comparisonType: "equals",
          possibleValues: ["New Lead", "Old Lead"]
        }
      ];

      expect(processFieldCriteria(fieldCriteria)).toEqual(expectedResult);
    });

    test("Complex example with mixed comparison operations", () => {
      const fieldCriteria = `{ "Lead_Source": "Bluewell Website, PLI.com.au, PLI Quote Form, PLI Direct Quote, PMI, ", "Zip_Code": "not_starts_with:43", "Business_Occupation": "notcontains:Jumping, notcontains:castle, notcontains:bounce, notcontains:bouncy, notcontains:bubble soccer, notcontains:inflatable, notcontains:amusement, notcontains:Labour hire, notcontains:labour hire, notcontains:hire of labour, notcontains:labor hire, notcontains:labor hire, notcontains:Railway, notcontains:Signal, notcontains:Rail", "Lead_type": "notcontains:householders, notcontains:loan, notcontains:motor" }`;

      const expectedResult = [
        {
          fieldName: "Lead_Source",
          comparisonType: "equals",
          possibleValues: [
            "Bluewell Website",
            "PLI.com.au",
            "PLI Quote Form",
            "PLI Direct Quote",
            "PMI"
          ]
        },
        {
          fieldName: "Zip_Code",
          comparisonType: "not_starts_with",
          possibleValues: ["43"]
        },
        {
          fieldName: "Business_Occupation",
          comparisonType: "notcontains",
          possibleValues: [
            "Jumping",
            "castle",
            "bounce",
            "bouncy",
            "bubble soccer",
            "inflatable",
            "amusement",
            "Labour hire",
            "labour hire",
            "hire of labour",
            "labor hire",
            "labor hire",
            "Railway",
            "Signal",
            "Rail"
          ]
        },
        {
          fieldName: "Lead_type",
          comparisonType: "notcontains",
          possibleValues: ["householders", "loan", "motor"]
        }
      ];

      const actualResult = processFieldCriteria(fieldCriteria);

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe("Converting from array to JSON", () => {
    test("Example with mixed comparison operations", () => {
      const fieldCriteriaJSON = `{"Lead_Source":"equals:Facebook,equals:Blah,notequal:foo","Lead_Status":"equals:New Lead,equals:Old Lead"}`;

      const arrayOfFieldCriteria = [
        {
          fieldName: "Lead_Source",
          comparisonType: "equals",
          possibleValues: ["Facebook", "Blah"]
        },
        {
          fieldName: "Lead_Source",
          comparisonType: "notequal",
          possibleValues: ["foo"]
        },
        {
          fieldName: "Lead_Status",
          comparisonType: "equals",
          possibleValues: ["New Lead", "Old Lead"]
        }
      ];

      expect(generateFieldCriteriaJSON(arrayOfFieldCriteria)).toEqual(
        fieldCriteriaJSON
      );
    });
  });
});
