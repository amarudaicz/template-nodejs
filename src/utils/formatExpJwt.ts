export function formatExpiration(exp:number) {
    const expMilliseconds = exp * 1000;
    const expirationDate = new Date(expMilliseconds);
    const formattedExpiration = expirationDate.toLocaleString();
    return formattedExpiration;
  }