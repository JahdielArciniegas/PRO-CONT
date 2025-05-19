export interface CreateBoard {
  id_user: string;
  title: string;
  pros: string;
  cons: string;
}

export interface Board extends CreateBoard {
  collectionId: string;
  collectionName: string;
  id: string;
}
