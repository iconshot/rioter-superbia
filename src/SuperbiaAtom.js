import { Atom } from "rioter";

class SuperbiaAtom extends Atom {
  constructor(store, documentKeys) {
    super(store);

    this.data = {};

    this.documentKeys = documentKeys;
  }

  parseResult = (result, data = {}) => {
    if (result === null) {
      return null;
    }

    if (Array.isArray(result)) {
      return result.map((item) => this.parseResult(item, data));
    }

    if (typeof result === "object") {
      const newResult = {};

      for (const key in result) {
        newResult[key] = this.parseResult(result[key], data);
      }

      const isDocument =
        this.documentKeys.id in result && this.documentKeys.typename in result;

      if (!isDocument) {
        return newResult;
      }

      const id = result[this.documentKeys.id];
      const typename = result[this.documentKeys.typename];

      if (!(typename in data)) {
        data[typename] = {};
      }

      data[typename][id] = newResult;

      return result[this.documentKeys.id];
    }

    return result;
  };

  clear = () => {
    this.data = {};
  };
}

export default SuperbiaAtom;
