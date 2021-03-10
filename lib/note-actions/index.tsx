import React, { Component } from 'react';
import { connect } from 'react-redux';
import FocusTrap from 'focus-trap-react';
import { includes, isEmpty } from 'lodash';

import ClipboardButton from '../components/clipboard-button';
import CheckboxControl from '../controls/checkbox';
import getNoteTitleAndPreview from '../utils/note-utils';

import actions from '../state/actions';

import * as S from '../state';
import * as T from '../types';

type StateProps = {
  hasRevisions: boolean;
  isMarkdown: boolean;
  isPinned: boolean;
  noteId: T.EntityId;
  note: T.Note;
};

type DispatchProps = {
  markdownNote: (noteId: T.EntityId, shouldEnableMarkdown: boolean) => any;
  onFocusTrapDeactivate: () => any;
  pinNote: (noteId: T.EntityId, shouldPin: boolean) => any;
  publishNote: (noteId: T.EntityId, shouldPublish: boolean) => any;
  shareNote: () => any;
  toggleRevisions: () => any;
  trashNote: () => any;
};

type Props = StateProps & DispatchProps;

export class NoteActions extends Component<Props> {
  static displayName = 'NoteActions';
  isMounted = false;

  componentDidMount() {
    this.isMounted = true;
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  handleFocusTrapDeactivate = () => {
    const { onFocusTrapDeactivate } = this.props;

    if (this.isMounted) {
      onFocusTrapDeactivate();
    }
  };

  getNoteLink = (note: T.Note, noteId: T.EntityId) => {
    const { title } = getNoteTitleAndPreview(note);
    return `[${title}](simplenote://note/${noteId})`;
  };

  getPublishURL = (url: string | undefined) => {
    return isEmpty(url) ? null : `http://simp.ly/p/${url}`;
  };

  render() {
    const { hasRevisions, isMarkdown, isPinned, noteId, note } = this.props;
    const isPublished = includes(note.systemTags, 'published');
    const publishURL = this.getPublishURL(note.publishURL);
    const noteLink = this.getNoteLink(note, noteId);

    return (
      <FocusTrap
        focusTrapOptions={{
          clickOutsideDeactivates: true,
          onDeactivate: this.handleFocusTrapDeactivate,
        }}
      >
        <div className="note-actions theme-color-bg theme-color-fg theme-color-border">
          <div className="note-actions-panel theme-color-border">
            <label
              className="note-actions-item"
              htmlFor="note-actions-pin-checkbox"
            >
              <span className="note-actions-item-text">
                <span className="note-actions-name">Pin to top</span>
              </span>
              <span className="note-actions-item-control">
                <CheckboxControl
                  id="note-actions-pin-checkbox"
                  className="theme-color-border"
                  checked={isPinned}
                  onChange={() => {
                    this.pinNote(!isPinned);
                  }}
                />
              </span>
            </label>

            <label
              className="note-actions-item"
              htmlFor="note-actions-markdown-checkbox"
            >
              <span className="note-actions-item-text">
                <span className="note-actions-name">Markdown</span>
              </span>
              <span className="note-actions-item-control">
                <CheckboxControl
                  id="note-actions-markdown-checkbox"
                  checked={isMarkdown}
                  onChange={() => {
                    this.markdownNote(!isMarkdown);
                  }}
                />
              </span>
            </label>

            <div className="note-actions-item note-actions-internal-link">
              <div className="note-actions-copy">
                {/* <p className="note-actions-detail note-actions-link-text theme-color-fg-dim">{`simplenote://note/${noteId}`}</p> */}
                <ClipboardButton
                  text={noteLink}
                  linkText="Copy Internal Link"
                />
              </div>
            </div>

            {hasRevisions && (
              <div
                className="note-actions-item"
                onClick={this.props.toggleRevisions}
              >
                History…
              </div>
            )}
            {hasRevisions || (
              <div className="note-actions-item">History (unavailable)</div>
            )}
          </div>
          <div className="note-actions-panel note-actions-public-link theme-color-border">
            <label
              className="note-actions-item"
              htmlFor="note-actions-publish-checkbox"
            >
              <span className="note-actions-item-text">
                <span className="note-actions-name">Publish</span>
              </span>
              <span className="note-actions-item-control">
                <CheckboxControl
                  id="note-actions-publish-checkbox"
                  checked={isPublished}
                  onChange={() => {
                    this.publishNote(!isPublished);
                  }}
                />
              </span>
            </label>
            <div className="note-actions-copy">
              {isPublished && (
                /* <p className="note-actions-detail note-actions-link-text theme-color-fg-dim">
                {publishURL}
              </p> */
                <ClipboardButton text={publishURL} linkText="Copy Link" />
              )}
              {isPublished || (
                <span className="note-actions-disabled">Copy Link</span>
              )}
            </div>
          </div>
          <div className="note-actions-panel theme-color-border">
            <div className="note-actions-item" onClick={this.props.shareNote}>
              Collaborate…
            </div>
          </div>
          <div className="note-actions-panel theme-color-border">
            <div
              className="note-actions-item note-actions-trash"
              onClick={this.props.trashNote}
            >
              Move to Trash
            </div>
          </div>
        </div>
      </FocusTrap>
    );
  }

  pinNote = (shouldPin: boolean) =>
    this.props.pinNote(this.props.noteId, shouldPin);

  publishNote = (shouldPublish: boolean) =>
    this.props.publishNote(this.props.noteId, shouldPublish);

  markdownNote = (shouldEnableMarkdown: boolean) =>
    this.props.markdownNote(this.props.noteId, shouldEnableMarkdown);
}

const mapStateToProps: S.MapState<StateProps> = ({
  data,
  ui: { openedNote },
}) => {
  const note = data.notes.get(openedNote);

  return {
    noteId: openedNote,
    note: note,
    hasRevisions: !!data.noteRevisions.get(openedNote)?.size,
    isMarkdown: note?.systemTags.includes('markdown'),
    isPinned: note?.systemTags.includes('pinned'),
  };
};

const mapDispatchToProps: S.MapDispatch<DispatchProps> = {
  markdownNote: actions.data.markdownNote,
  onFocusTrapDeactivate: actions.ui.toggleNoteActions,
  pinNote: actions.data.pinNote,
  publishNote: actions.data.publishNote,
  shareNote: () => actions.ui.showDialog('SHARE'),
  toggleRevisions: actions.ui.toggleRevisions,
  trashNote: actions.ui.trashOpenNote,
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteActions);
