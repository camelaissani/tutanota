// @flow
import m from "mithril"
import {assertMainOrNode} from "../api/Env"
import {lang} from "../misc/LanguageViewModel"
import stream from "mithril/stream/stream.js"
import {nativeApp} from '../native/NativeWrapper.js'
import {Request} from "../api/common/WorkerProtocol.js"
import {showProgressDialog} from "../gui/base/ProgressDialog.js"
import {noOp} from "../api/common/utils/Utils"
import {Icons} from "../gui/base/icons/Icons"
import type {TextFieldAttrs} from "../gui/base/TextFieldN"
import {TextFieldN} from "../gui/base/TextFieldN"
import type {ButtonAttrs} from "../gui/base/ButtonN"
import {ButtonN, ButtonType} from "../gui/base/ButtonN"
import {fileApp} from "../native/FileApp"
import {attachDropdown} from "../gui/base/DropdownN"
import type {DropDownSelectorAttrs} from "../gui/base/DropDownSelectorN"
import {DropDownSelectorN} from "../gui/base/DropDownSelectorN"

assertMainOrNode()

const DownloadLocationStrategy = {
	ALWAYS_ASK: 0,
	CHOOSE_DIRECTORY: 1
}

export class DesktopSettingsViewer implements UpdatableSettingsViewer {
	view: Function;

	_isDefaultMailtoHandler: stream<?boolean>;
	_defaultDownloadPath: stream<string>;
	_hideMinimizedWindows: stream<?boolean>;
	_isPathDialogOpen: boolean;

	constructor() {
		this._requestDesktopConfig()

		this.view = () => {
			const setDefaultMailtoHandlerAttrs: DropDownSelectorAttrs<boolean> = {
				label: "defaultMailHandler_label",
				helpLabel: () => lang.get("defaultMailHandler_msg"),
				items: [
					{name: lang.get("unregistered_label"), value: false},
					{name: lang.get("registered_label"), value: true}
				],
				selectedValue: this._isDefaultMailtoHandler,
				selectionChangedHandler: v => {
					showProgressDialog("pleaseWait_msg", this._updateDefaultMailtoHandler(v), false)
						.then(() => {
							this._isDefaultMailtoHandler(v)
							m.redraw()
						})
				}
			}

			const setHideMinimizedWindowsAttrs: DropDownSelectorAttrs<boolean> = {
				label: "hideMinimizedWindowsToTray_action",
				items: [
					{name: lang.get("yes_label"), value: true},
					{name: lang.get("no_label"), value: false}
				],
				selectedValue: this._hideMinimizedWindows,
				selectionChangedHandler: v => {
					this._hideMinimizedWindows(v)
					this.setHideMinimizedWindows(v)
				}
			}

			const changeDefaultDownloadPathAttrs: ButtonAttrs = attachDropdown({
				label: "edit_action",
				type: ButtonType.Action,
				click: noOp,
				icon: () => Icons.Edit
			}, () => [
				{
					label: "alwaysAsk_action",
					click: () => this.setDefaultDownloadPath(DownloadLocationStrategy.ALWAYS_ASK),
					type: ButtonType.Dropdown
				},
				{
					label: "chooseDirectory_action",
					click: () => this.setDefaultDownloadPath(DownloadLocationStrategy.CHOOSE_DIRECTORY),
					type: ButtonType.Dropdown
				}
			], () => !this._isPathDialogOpen, 200)

			const defaultDownloadPathAttrs: TextFieldAttrs = {
				label: "defaultDownloadPath_label",
				value: this._defaultDownloadPath,
				injectionsRight: () => m(ButtonN, changeDefaultDownloadPathAttrs),
				disabled: true
			}

			return [
				m("#user-settings.fill-absolute.scroll.plr-l.pb-xl", [
					m(".h4.mt-l", lang.get('desktopSettings_label')),
					env.platformId === 'linux' ? null : m(DropDownSelectorN, setDefaultMailtoHandlerAttrs),
					m(DropDownSelectorN, setHideMinimizedWindowsAttrs),
					m(TextFieldN, defaultDownloadPathAttrs)
				])
			]
		}
	}

	_updateDefaultMailtoHandler(v: boolean): Promise<void> {
		if (v) {
			return nativeApp.invokeNative(new Request('registerMailto', []))
		} else {
			return nativeApp.invokeNative(new Request('unregisterMailto', []))
		}
	}

	_requestDesktopConfig() {
		nativeApp.invokeNative(new Request('sendDesktopConfig', []))
		         .then(desktopConfig => {
			         this._isDefaultMailtoHandler = stream(desktopConfig.isMailtoHandler)
			         this._defaultDownloadPath = stream(desktopConfig.defaultDownloadPath
				         ? desktopConfig.defaultDownloadPath
				         : lang.get('alwaysAsk_action')
			         )
			         this._hideMinimizedWindows = stream(desktopConfig.hideMinimizedWindows)
			         m.redraw()
		         })
	}

	setHideMinimizedWindows(hideMinimizedWindows: boolean) {
		nativeApp.invokeNative(new Request('sendDesktopConfig', []))
		         .then(config => {
			         config.hideMinimizedWindows = hideMinimizedWindows
			         return nativeApp.invokeNative(new Request('updateDesktopConfig', [config]))
		         }).then(() => m.redraw())
	}

	setDefaultDownloadPath(v: $Values<typeof DownloadLocationStrategy>) {
		this._isPathDialogOpen = true
		Promise.join(
			nativeApp.invokeNative(new Request('sendDesktopConfig', [])),
			v === DownloadLocationStrategy.ALWAYS_ASK
				? Promise.resolve([null])
				: fileApp.openFolderChooser(),
			(config, newPaths) => {
				config.defaultDownloadPath = newPaths[0]
				this._defaultDownloadPath(newPaths[0]
					? newPaths[0]
					: lang.get('alwaysAsk_action'))
				return config
			}).then(config => nativeApp.invokeNative(new Request('updateDesktopConfig', [config])))
		       .then(() => {
			       this._isPathDialogOpen = false
			       m.redraw()
		       })
	}

	// this is all local for now
	entityEventsReceived = noOp
}