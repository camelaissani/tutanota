// @flow

import {create, TypeRef} from "../../common/EntityFunctions"

export const ReportPhishingGetReturnTypeRef: TypeRef<ReportPhishingGetReturn> = new TypeRef("tutanota", "ReportPhishingGetReturn")
export const _TypeModel: TypeModel = {
	"name": "ReportPhishingGetReturn",
	"since": 40,
	"type": "DATA_TRANSFER_TYPE",
	"id": 1045,
	"rootId": "CHR1dGFub3RhAAQV",
	"versioned": false,
	"encrypted": false,
	"values": {
		"_format": {
			"name": "_format",
			"id": 1046,
			"since": 40,
			"type": "Number",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		}
	},
	"associations": {
		"markers": {
			"name": "markers",
			"id": 1047,
			"since": 40,
			"type": "AGGREGATION",
			"cardinality": "Any",
			"refType": "ReportFieldMarker",
			"final": false
		}
	},
	"app": "tutanota",
	"version": "40"
}

export function createReportPhishingGetReturn(values?: $Shape<$Exact<ReportPhishingGetReturn>>): ReportPhishingGetReturn {
	return Object.assign(create(_TypeModel, ReportPhishingGetReturnTypeRef), values)
}
