export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'long' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  let month = mo.charAt(0).toUpperCase() + mo.slice(1)
  switch (month) {
    case "Juillet" :
      month = month.substr(0,4) + "."
      break
    case "Mai" :
      month = month
      break
    case "Juin" :
      month = month
      break
    default :
     month = month.substr(0,3) + "."
  }
  return `${parseInt(da)} ${month} ${ye.toString().substr(2,4)}`
}

export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}