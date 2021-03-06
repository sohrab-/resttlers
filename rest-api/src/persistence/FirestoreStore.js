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
      const { count } = metadata.data() || { count: 0 };

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
      const startAfterDoc = await this.settlementsCollection
        .doc(startAfter)
        .get();
      if (!startAfterDoc.empty) {
        ref = ref.startAt(startAfterDoc);
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
    return settlementsCollection.doc(id).delete();
  }

  async addToBuildQueue(settlementId, building, idFn) {
    return this.db.runTransaction(async t => {
      const settlementDoc = this.settlementsCollection.doc(settlementId);
      // get building id seed
      const settlement = await t.get(settlementDoc);
      const { buildingIdSeed } = settlement.data();

      // persist
      const id = idFn(buildingIdSeed);
      t.update(settlementDoc, {
        buildQueue: Firestore.FieldValue.arrayUnion({
          building: { ...building, id }
        }),
        buildingIdSeed: Firestore.FieldValue.increment(1)
      });

      return id;
    });
  }

  async updateBuildingStatus(settlementId, buildingId, status) {
    return this.settlementsCollection.doc(settlementId).update({
      [`buildings.${buildingId}.status`]: status
    });
  }
}
