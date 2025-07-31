export default function getParamId(param: string | string[] | undefined): number | undefined {
  let actualString: string | undefined;

  if (Array.isArray(param)) {
    if (param.length > 0) {
      actualString = param[0];
    }
  }
  else if (typeof param === "string") {
    actualString = param;
  }

  if (actualString) {
    const stringToNumber = Number.parseInt(actualString);

    if (Number.isNaN(stringToNumber)) {
      throw new TypeError("Geen nummer");
    }

    return stringToNumber;
  }
}
