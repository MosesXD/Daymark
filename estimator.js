(() => {
  const $ = id => document.getElementById(id);
  const money = new Intl.NumberFormat("en-TT", {style:"currency",currency:"TTD",maximumFractionDigits:0});
  function calculate(){
    const base=Number($("projectType").value),pages=Number($("pages").value),complexity=Number($("complexity").value),rate=Number($("rate").value);
    const extras=($("copy").checked?500:0)+($("responsive").checked?350:0);
    const rush=$("rush").checked?1.25:1;
    // Transparent demo assumptions; replace after gathering real project data.
    const pageFactor=1+Math.max(0,pages-1)*0.08;
    const midpoint=(base*pageFactor*complexity+extras)*rush;
    const rateAdjustment=rate>0?Math.max(0.75,Math.min(1.5,rate/250)):1;
    const estimate=midpoint*rateAdjustment;
    $("pagesOut").value=pages;
    $("estimate").textContent=`${money.format(estimate*0.85)} – ${money.format(estimate*1.2)}`;
    $("breakdown").textContent=`Planning midpoint ${money.format(estimate)} · based on editable demo assumptions, not a market-validated price.`;
    return {low:Math.round(estimate*0.85),high:Math.round(estimate*1.2),mid:Math.round(estimate)};
  }
  ["projectType","pages","complexity","copy","responsive","rush","rate"].forEach(id=>$(id).addEventListener("input",calculate));
  $("estimateForm").addEventListener("submit",async e=>{
    e.preventDefault();const result=calculate();
    const summary=`Project price planning estimate: ${money.format(result.low)}–${money.format(result.high)} (midpoint ${money.format(result.mid)}). Demo estimate only; confirm scope, revisions, timeline, expenses, and terms before quoting.`;
    try{await navigator.clipboard.writeText(summary);$("message").textContent="Estimate summary copied. Review and adjust it before sharing.";}
    catch{$("message").textContent=summary;}
  });
  calculate();
})();
