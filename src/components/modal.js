import React, { Component } from 'react';

import {observer} from 'mobx-react';
import Data from '../models';

import { colors } from '../constants';

@observer
class ModalContainer extends Component {

  render() {

    const modal = Data.modals[0];

    if (!modal) {
      return null;
    }

    const body = modal.body || <p>{modal.message}</p>;

    const buttons = [];

    if (modal.cancel || modal.cancelText || modal.ok) {

      const cancel = modal.cancel || (() => Data.dismissModal(modal));
      const cancelText = modal.cancelText || 'Cancel';

      buttons.push(
        <div
          onClick={cancel}
          style={{
            display: 'inline-block',
            padding: '12px 16px',
            backgroundColor: colors.light,
            borderRadius: 4,
            color: colors.dark,
            minWidth: 100,
            textAlign: 'center',
            marginLeft: 12
          }}
        >
          {cancelText}
        </div>
      );
    }

    if (buttons.length === 0 || modal.ok || modal.okText) {

      const ok = modal.ok || (() => Data.dismissModal(modal));
      const okText = modal.okText || 'OK';

      buttons.push(
        <div onClick={ok} style={{
          display: 'inline-block',
          padding: '12px 16px',
          backgroundColor: modal.danger ? colors.danger : colors.primary,
          borderRadius: 4,
          minWidth: 100,
          color: 'white',
          textAlign: 'center',
          marginLeft: 12
        }}>{okText}</div>
      );
    }

    return (
      <div style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'fixed',
        backgroundColor: 'rgba(0,0,0,.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...this.props.style
      }}
      onClick={()=>Data.dismissModal(modal)}
      >

        <div style={{
          backgroundColor: 'white',
          width: '90vw',
          maxWidth: '350px',
          padding: 16,
          borderRadius: 4
        }}>

          <h2 style={{ marginTop: 0 }}>{modal.title}</h2>

          {body}

          <div style={{ textAlign: 'right' }}>
            {buttons}
          </div>

        </div>

      </div>
    );
  }
}

export default ModalContainer;
