addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


/**
 * Respond with hello worker text
 * @param {Request} request
 */
class ChangeTitle {
  element(e) {
    e.prepend("My Style of ");
  }
}

class ChangeH1 {
  element(e) {
    e.prepend("Newly customised my ");
  }
}

class ChangeDescription {
  element(e) {
    e.setInnerContent("Cloudflare is awesome to work on!!");
  }
}

class ChangeButton {
  element(e) {
    e.setInnerContent("Click to see my CloudFlare internship Project");
    e.setAttribute("href", "https://internship_project.manishsubdomain.workers.dev");
  }
}

function getCookie(request, name) {
  let res;
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim();
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1];
        res = cookieVal;
      }
    })
  }
  return res;
}
 
let req = 0;
async function handleRequest(request) {
  const response = await fetch("https://cfw-takehome.developers.workers.dev/api/variants");
  let rep = await response.json();
  const PageNumber =  getCookie(request, 'page');
  let v;
  if(PageNumber){
    v = PageNumber
  }else{
   v = Math.random() > 0.5 ? 1 : 0;}
  //console.log(rep);
  let html = await fetch(rep.variants[v]);
  res = new Response(html.body, html);
  res.headers.set('Set-Cookie',`page=${v}`)
  const ChangeRes = new HTMLRewriter().on('title', new ChangeTitle()).on('h1#title', new ChangeH1()).on('p#description', new ChangeDescription()).on('a#url', new ChangeButton());
  return ChangeRes.transform(res);
  //return new Response(html, {
    //headers: { 'content-type': 'text/html' },
  //})
}
