import Firestore from "@google-cloud/firestore";

const METADATA_DOC = "__metadata";

export default class FirestoreStore {
  constructor({ projectId, settlementsCollectionName }) {
    this.db = new Firestore({ projectId });
    this.settlementsCollection = this.db.collection(settlementsCollectionName);
    this.metadataRef = this.settlementsCollection.doc(METADATA_DOC);
  }

  async createSettlement(settlement, idFn) {
    return this.db.runTransaction(async t => {
      // get settlement count
      const metadata = await t.get(this.metadataRef);
      let count = metadata.data() !== undefined ? metadata.data() : 0;

      // persist
      const id = idFn(count);
      t.set(this.settlementsCollection.doc(id), { ...settlement, id });

      if (count === 0) {
        t.set(this.metadataRef, { count: 1 });
      } else {
        t.update(this.metadataRef, {
          count: Firestore.FieldValue.increment(1)
        });
      }

      return id;
    });
  }

  async getSettlements(
    { name, leader, startAfter, pageSize, sortBy, sortDirection } = {
      pageSize: 10,
      sortBy: "createdAt",
      sortDirection: "desc"
    }
  ) {
    let ref = this.settlementsCollection.where("active", "==", true);
    if (name) {
      ref = ref.where("name", "==", name);
    }
    if (leader) {
      ref = ref.where("leader", "==", leader);
    }

    ref = ref.orderBy(sortBy, sortDirection);

    if (startAfter) {
      const startAfter = await this.settlementsCollection.doc(startAfter).get();
      if (!startAfter.empty) {
        ref = ref.startAt(startAfter);
      }
    }

    const { docs = [] } = await ref.limit(pageSize).get();

    return docs.map(doc => ({ ...doc.data(), id: doc.id }));
  }

  async getSettlement(id) {
    const doc = await this.settlementsCollection.doc(id).get();
    return doc.exists ? { ...doc.data(), id: doc.id } : null;
  }

  async deleteSettlement(id) {
    return this.db.runTransaction(async t => {
      t.delete(this.settlementsCollection.doc(id));
      t.update(this.metadataRef, {
        count: Firestore.FieldValue.decrement(1)
      });
    });
  }

  async addToBuildQueue(settlementId, item) {
    return this.settlementsCollection.doc(settlementId).update({
      buildQueue: Firestore.FieldValue.arrayUnion(item)
    });
  }

  async updateBuildingStatus(settlementId, buildingId, status) {
    return this.settlementsCollection.doc(settlementId).update({
      [`buildings.${buildingId}.status`]: status
    });
  }
}
