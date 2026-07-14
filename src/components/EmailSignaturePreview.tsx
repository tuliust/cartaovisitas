import type { EmailSignatureModel } from '../lib/emailSignature'

type EmailSignaturePreviewProps = { model: EmailSignatureModel }

export function EmailSignaturePreview({ model }: EmailSignaturePreviewProps) {
  return (
    <table
      role="presentation"
      cellPadding="0"
      cellSpacing="0"
      width="580"
      style={{ width: 580, maxWidth: 580, borderCollapse: 'collapse', fontFamily: 'Arial, Helvetica, sans-serif', color: '#111111' }}
    >
      <tbody>
        <tr>
          <td width="182" style={{ width: 182, padding: '0 18px 0 0', verticalAlign: 'top', borderRight: '2px solid #111111' }}>
            <img src={model.logoUrl} alt="Invest RS" width="164" style={{ display: 'block', width: 164, maxWidth: 164, height: 'auto', border: 0 }} />
            <div style={{ height: 14, lineHeight: '14px' }}>&nbsp;</div>
            <a href={model.vcardUrl} style={{ display: 'block', width: 164, textAlign: 'center', textDecoration: 'none' }}>
              <img
                src={model.qrImageUrl}
                alt="QR Code para adicionar contato"
                width="88"
                height="88"
                style={{ display: 'block', width: 88, height: 88, margin: '0 auto', border: 0, background: '#ffffff' }}
              />
            </a>
          </td>
          <td style={{ padding: '0 0 0 20px', verticalAlign: 'top' }}>
            <div style={{ font: 'bold 17px/1.3 Arial, Helvetica, sans-serif', color: '#111111' }}>{model.name}</div>
            {model.jobTitle ? <div style={{ font: '14px/1.45 Arial, Helvetica, sans-serif', color: '#111111' }}>{model.jobTitle}</div> : null}
            {model.department ? <div style={{ font: '12px/1.45 Arial, Helvetica, sans-serif', color: '#444444' }}>{model.department}</div> : null}
            <div style={{ height: 16, lineHeight: '16px' }}>&nbsp;</div>
            <table role="presentation" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                {model.contacts.map((contact) => (
                  <tr key={contact.kind}>
                    <td style={{ width: 22, padding: '2px 7px 2px 0', verticalAlign: 'middle' }}>
                      {contact.iconUrl ? (
                        <a href={contact.href}>
                          <img src={contact.iconUrl} alt={contact.alt} width="15" height="15" style={{ display: 'block', width: 15, height: 15, border: 0 }} />
                        </a>
                      ) : '\u00a0'}
                    </td>
                    <td style={{ padding: '2px 0', verticalAlign: 'middle', font: '12px/1.45 Arial, Helvetica, sans-serif', color: '#444444' }}>
                      <a href={contact.href} style={{ color: '#444444', textDecoration: 'none' }}>
                        {contact.text}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
        {model.confidentiality ? (
          <tr>
            <td colSpan={2} style={{ padding: '16px 0 0', font: 'italic 9px/1.45 Arial, Helvetica, sans-serif', color: '#777777' }}>
              {model.confidentiality}
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  )
}
