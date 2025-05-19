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

export interface WriteBoardProps {
  userId: string;
  idBoard?: string;
}

export interface content {
  id: string;
  value: string;
  status: string;
}

export interface userIa {
  id: string;
  userId: String;
}
