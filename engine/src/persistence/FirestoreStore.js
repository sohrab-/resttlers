import Firestore from "@google-cloud/firestore";

// TODO remove building type
export default class FirestoreStore {
  constructor({
    projectId,
    buildingTypesCollectionName,
    settlementsCollectionName
  }) {
    this.db = new Firestore({ projectId });
    this.buildingTypesCollection = this.db.collection(
      buildingTypesCollectionName
    );
    this.settlementsCollection = this.db.collection(settlementsCollectionName);
  }

  async getBuildingTypes() {
    const { docs } = await this.buildingTypesCollection.get();
    return docs.reduce((accum, doc) => {
      accum[doc.id] = { ...doc.data(), id: doc.id };
      return accum;
    }, {});
  }

  async getSettlements() {
    const { docs = [] } = await this.settlementsCollection
      .where("status", "==", "verified")
      .get();
    return docs.map(doc => ({ ...doc.data(), id: doc.id }));
  }

  async getSettlement(id) {
    const doc = await this.settlementsCollection.doc(id).get();
    return { ...doc.data(), id: doc.id };
  }

  async saveSettlements(settlements) {
    if (settlements.length < 1) {
      return;
    }
    const batch = this.db.batch();
    settlements.forEach(settlement => {
      const { id, ...theRest } = settlement;
      batch.update(this.settlementsCollection.doc(id), theRest);
    });
    return batch.commit();
  }
}
