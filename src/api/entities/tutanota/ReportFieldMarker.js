// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const ReportFieldMarkerTypeRef: TypeRef<ReportFieldMarker> = new TypeRef("tutanota", "ReportFieldMarker")
export const _TypeModel: TypeModel = {
	"name": "ReportFieldMarker",
	"since": 40,
	"type": "AGGREGATED_TYPE",
	"id": 1037,
	"rootId": "CHR1dGFub3RhAAQN",
	"versioned": false,
	"encrypted": false,
	"values": {
		"_id": {
			"name": "_id",
			"id": 1038,
			"since": 40,
			"type": "CustomId",
			"cardinality": "One",
			"final": true,
			"encrypted": false
		},
		"marker": {
			"name": "marker",
			"id": 1039,
			"since": 40,
			"type": "String",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		}
	},
	"associations": {},
	"app": "tutanota",
	"version": "40"
}

export function createReportFieldMarker(values?: $Shape<$Exact<ReportFieldMarker>>): ReportFieldMarker {
	return Object.assign(create(_TypeModel, ReportFieldMarkerTypeRef), values)
}
