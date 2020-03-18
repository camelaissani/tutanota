// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const ReportedMailDataTypeRef: TypeRef<ReportedMailData> = new TypeRef("tutanota", "ReportedMailData")
export const _TypeModel: TypeModel = {
	"name": "ReportedMailData",
	"since": 40,
	"type": "AGGREGATED_TYPE",
	"id": 1030,
	"rootId": "CHR1dGFub3RhAAQG",
	"versioned": false,
	"encrypted": false,
	"values": {
		"_id": {
			"name": "_id",
			"id": 1031,
			"since": 40,
			"type": "CustomId",
			"cardinality": "One",
			"final": true,
			"encrypted": false
		},
		"mailSessionKey": {
			"name": "mailSessionKey",
			"id": 1033,
			"since": 40,
			"type": "Bytes",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		}
	},
	"associations": {
		"mailId": {
			"name": "mailId",
			"id": 1032,
			"since": 40,
			"type": "LIST_ELEMENT_ASSOCIATION",
			"cardinality": "One",
			"refType": "Mail",
			"final": false,
			"external": false
		}
	},
	"app": "tutanota",
	"version": "40"
}

export function createReportedMailData(values?: $Shape<$Exact<ReportedMailData>>): ReportedMailData {
	return Object.assign(create(_TypeModel, ReportedMailDataTypeRef), values)
}
