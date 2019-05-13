import Firestore from "@google-cloud/firestore";

export default class FirestoreStore {
  constructor({ projectId, settlementsCollectionName }) {
    this.db = new Firestore({ projectId });
    this.settlementsCollection = this.db.collection(settlementsCollectionName);
  }

  async getSettlements() {
    const { docs = [] } = await this.settlementsCollection
      .where("active", "==", true)
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
