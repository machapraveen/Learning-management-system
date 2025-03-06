export interface SubBranch {
  id: string;
  title: string;
  description?: string;
  subbranches?: SubBranch[];
}

export interface Branch {
  id: string;
  title: string;
  description?: string;
  subbranches: SubBranch[];
}