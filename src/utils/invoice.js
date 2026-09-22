import { plainMoney, dateTime } from './format.js'

const escapeHtml = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )

const pad = (text, width, right = false) => {
  const s = String(text)
  if (s.length >= width) return s.slice(0, width)
  return right ? s.padStart(width) : s.padEnd(width)
}

// ---------- Plain text invoice (used for "Download") ----------
export function invoiceAsText(order, restaurant) {
  const line = '-'.repeat(52)
  const rows = order.lines.map(
    (l) =>
      `${pad(l.name, 22)}${pad(l.qty, 5, true)}${pad(l.price.toFixed(2), 10, true)}${pad(
        (l.price * l.qty).toFixed(2),
        15,
        true,
      )}`,
  )

  return [
    (restaurant?.name || 'The EmberGrill').toUpperCase(),
    restaurant?.branches?.length ? `Branch: ${order.branch || restaurant.branches[0]}` : '',
    restaurant?.address || '',
    restaurant?.phone ? `Phone: ${restaurant.phone}` : '',
    line,
    `Invoice : ${order.invoiceNo}`,
    `Date    : ${dateTime(order.createdAt)}`,
    `Status  : ${order.status === 'completed' ? 'Completed' : 'Upcoming'}`,
    line,
    `Customer: ${order.customer.name}`,
    `Phone   : ${order.customer.phone}`,
    `Table   : ${order.table}    Seat: ${order.seat}`,
    line,
    `${pad('Item', 22)}${pad('Qty', 5, true)}${pad('Price', 10, true)}${pad('Amount', 15, true)}`,
    line,
    ...rows,
    line,
    `${pad('Subtotal', 37)}${pad(plainMoney(order.subtotal), 15, true)}`,
    `${pad('VAT (5%)', 37)}${pad(plainMoney(order.vat), 15, true)}`,
    `${pad('TOTAL', 37)}${pad(plainMoney(order.total), 15, true)}`,
    line,
    'Thank you for dining with us!',
  ]
    .filter((row) => row !== '')
    .join('\n')
}

export function downloadInvoice(order, restaurant) {
  const blob = new Blob([invoiceAsText(order, restaurant)], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${order.invoiceNo}.txt`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ---------- Printable HTML invoice ----------
export function invoiceAsHtml(order, restaurant) {
  const rows = order.lines
    .map(
      (l, i) => `<tr>
        <td>${i + 1}</td><td>${escapeHtml(l.name)}</td>
        <td class="r">${l.qty}</td><td class="r">${l.price.toFixed(2)}</td>
        <td class="r">${(l.price * l.qty).toFixed(2)}</td></tr>`,
    )
    .join('')

  const logo = restaurant?.logo ? `<img src="${restaurant.logo}" class="logo" />` : ''

  return `<!DOCTYPE html><html><head><meta charset="utf-8" />
  <title>${escapeHtml(order.invoiceNo)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; color: #17211d; margin: 0; padding: 28px; }
    .wrap { max-width: 720px; margin: 0 auto; }
    .head { display: flex; align-items: center; gap: 16px; border-bottom: 3px solid #1e6f50; padding-bottom: 14px; }
    .logo { width: 64px; height: 64px; object-fit: cover; border-radius: 12px; }
    h1 { margin: 0; color: #1e6f50; font-size: 24px; }
    .muted { color: #6b7a73; font-size: 13px; }
    .meta { display: flex; justify-content: space-between; margin: 18px 0; font-size: 14px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th { background: #1e6f50; color: #fff; text-align: left; padding: 8px; }
    td { padding: 8px; border-bottom: 1px solid #e3e9e6; }
    .r { text-align: right; }
    .totals { margin-left: auto; width: 260px; margin-top: 14px; font-size: 14px; }
    .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
    .grand { border-top: 2px solid #e8702a; font-weight: bold; font-size: 17px; color: #e8702a; }
    .foot { text-align: center; margin-top: 30px; color: #6b7a73; font-size: 13px; }
  </style></head><body><div class="wrap">
    <div class="head">${logo}<div>
      <h1>${escapeHtml(restaurant?.name || 'The EmberGrill')}</h1>
      <div class="muted">${escapeHtml(order.branch || '')}${order.branch ? ' &middot; ' : ''}${escapeHtml(restaurant?.address || '')}</div>
      <div class="muted">${restaurant?.phone ? 'Phone: ' + escapeHtml(restaurant.phone) : ''}</div>
    </div></div>
    <div class="meta">
      <div><b>Invoice:</b> ${escapeHtml(order.invoiceNo)}<br /><b>Date:</b> ${dateTime(order.createdAt)}</div>
      <div style="text-align:right"><b>${escapeHtml(order.customer.name)}</b><br />${escapeHtml(order.customer.phone)}<br />
        Table ${escapeHtml(order.table)} &middot; Seat ${escapeHtml(order.seat)}</div>
    </div>
    <table><thead><tr><th>#</th><th>Item</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Amount</th></tr></thead>
      <tbody>${rows}</tbody></table>
    <div class="totals">
      <div><span>Subtotal</span><span>${plainMoney(order.subtotal)}</span></div>
      <div><span>VAT (5%)</span><span>${plainMoney(order.vat)}</span></div>
      <div class="grand"><span>Total</span><span>${plainMoney(order.total)}</span></div>
    </div>
    <div class="foot">Thank you for dining with us! &mdash; computer generated invoice</div>
  </div></body></html>`
}

// Prints through a hidden iframe so no pop-up window is needed
export function printInvoice(order, restaurant) {
  const frame = document.createElement('iframe')
  Object.assign(frame.style, {
    position: 'fixed',
    right: '0',
    bottom: '0',
    width: '0',
    height: '0',
    border: '0',
  })
  document.body.appendChild(frame)

  const doc = frame.contentWindow.document
  doc.open()
  doc.write(invoiceAsHtml(order, restaurant))
  doc.close()

  let printed = false
  const doPrint = () => {
    if (printed) return
    printed = true
    frame.contentWindow.focus()
    frame.contentWindow.print()
    setTimeout(() => frame.remove(), 1500)
  }
  frame.onload = doPrint
  // fallback: some browsers fire load before the handler is attached
  setTimeout(doPrint, 500)
}
