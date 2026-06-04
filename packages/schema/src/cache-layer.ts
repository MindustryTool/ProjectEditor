import * as v from "valibot";

// TODO: Add CacheLayer schema
// Java: arc.graphics.CacheLayer
export const cacheLayers = ["water", "mud", "cryofluid", "tar", "slag", "arkycite", "space", "normal", "walls"] as const;

export const CacheLayerSchema = v.picklist(cacheLayers);
