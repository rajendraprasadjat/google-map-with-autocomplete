import { EntityMeta } from ".";

export interface DirectoryParent {
  name: string;
  slug: string;
  meta: EntityMeta;
  c_addressRegionDisplayName: string;
  dm_directoryParents: DirectoryParent[];
}
