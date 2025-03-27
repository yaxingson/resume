async function fetchGithubData(name='yaxingson') {
  const url = `https://api.github.com/users/${name}`
  const data = await fetch(url).then(res=>res.json())
  const { blog } = data
  const created_at = new Date(data.created_at)

  return {
    created_at,
    blog,
    repos:[],
    issues:[],
    orgs:[]
  }
}

(async ()=>{
  console.log(await fetchGithubData())

})()
