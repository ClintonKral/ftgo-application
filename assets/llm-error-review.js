/* Advisory fallback tiles for saved previews and live run status. */
(function(root){
'use strict';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(packet){
 if(packet?.schema!=='llm-error-review-v1')throw new Error('Unsupported fallback artifact');
 const evidence=new Map((packet.evidence||[]).map(row=>[row.id,row]));
 const label='LLM analysis · not deterministically verified';
 const tiles=(packet.issues||[]).map(item=>`<article class="tile"><div class="tile-top"><h3>Potential issue: ${esc(item.title)}</h3></div>
 <div class="tile-sub"><b>${label}</b></div>
 <div class="ba"><div><small>BEFORE · LLM INTERPRETATION</small>${esc(item.before)}</div><div class="after"><small>WITH THIS PR · LLM INTERPRETATION</small>${esc(item.after)}</div></div>
 <div class="summary"><small>${label}</small><p>${esc(item.explanation)}</p></div>
 <div class="rule"><small>UNCERTAINTY</small><p>${esc(item.uncertainty)}</p></div>
 <section class="compact-evidence"><h4>Recorded evidence</h4>${item.evidence_ids.map(id=>{const row=evidence.get(id);return row?`<details><summary>${esc(id)} · ${esc(row.kind)} · ${esc(row.quality)}</summary><pre>${esc(row.content)}</pre></details>`:`<p>${esc(id)} · partial source diff</p>`;}).join('')}</section>
 <div class="ask desc-assessment"><b>Advisory review only. This issue cannot approve the PR or satisfy a failed deterministic check.</b></div></article>`).join('');
 return `<p><b>${label}</b></p><p>Automated verification was incomplete. Potential issues below are advisory.</p>
 <p>${esc(packet.identity?.repository||'')} · <code>${esc(packet.identity?.head_commit||'')}</code></p>
 <p>Diagnostic reference: <code>${esc(packet.diagnostic_id)}</code></p>
 ${tiles||`<p>${packet.status!=='completed'?esc(packet.reason||'Fallback analysis is unavailable.'):'No potential issues were returned. This does not establish that the PR is safe.'}</p>`}`;
}
root.llmErrorReview={render};
if(typeof module!=='undefined')module.exports=root.llmErrorReview;
})(typeof window!=='undefined'?window:globalThis);
