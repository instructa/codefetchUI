// Regex for validating URLs with protocol (http://, https://, etc.)
const protocolAndDomainRE =
  /^(?:(?:https?|ftp):\/\/)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(:[0-9]{1,5})?(\/.*)?$/;

// Regex for validating domain names without protocol (supports any subdomain)
const domainOnlyRE =
  /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?(\/.*)?$/;

// Regex for GitHub web URLs (with or without protocol)
const protocolGithubWebUrlRE = /^(?:https?:\/\/)?(?:www\.)?github\.com\/[\w.-]+\/[\w.-]+(?:\/.*)?$/;

export function isUrl(string: any): boolean {
  if (typeof string !== 'string') {
    return false;
  }

  return protocolGithubWebUrlRE.test(string);

  // // Trim whitespace
  // const trimmed = string.trim();

  // // Check if it has a protocol
  // if (trimmed.match(/^[a-zA-Z][a-zA-Z\d+\-.]*:/)) {
  //   // Has protocol - validate full URL
  //   return protocolAndDomainRE.test(trimmed);
  // } else {
  //   // No protocol - validate as domain
  //   return domainOnlyRE.test(trimmed);
  // }
}
