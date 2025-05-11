export interface CreateBoard {
  title: string;
  pros: string;
  cons: string;
}

export interface Board extends CreateBoard {
  collectionId: string;
  collectionName: string;
  id: string;
}
