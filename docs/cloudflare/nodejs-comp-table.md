When you write a Worker, you may need to import packages from npm ↗. Many npm packages rely on APIs from the Node.js runtime ↗, and will not work unless these Node.js APIs are available.

Cloudflare Workers provides a subset of Node.js APIs in two forms:

As built-in APIs provided by the Workers Runtime
As polyfill shim implementations that Wrangler adds to your Worker's code, allowing it to import the module, but calling API methods will throw errors.
Get Started
To enable built-in Node.js APIs and add polyfills, add the nodejs_compat compatibility flag to your wrangler configuration file, and ensure that your Worker's compatibility date is 2024-09-23 or later. Learn more about the Node.js compatibility flag and v2.

wrangler.jsonc
wrangler.toml
{
  "compatibility_flags": [
    "nodejs_compat"
  ],
  "compatibility_date": "2024-09-23"
}

Supported Node.js APIs
The runtime APIs from Node.js listed below as "🟢 supported" are currently natively supported in the Workers Runtime.

Deprecated or experimental APIs from Node.js ↗, and APIs that do not fit in a serverless context, are not included as part of the list below:

API Name	Natively supported by the Workers Runtime
Assertion testing	🟢 supported
Asynchronous context tracking	🟢 supported
Buffer	🟢 supported
Console	🟢 supported
Crypto	🟢 supported
Debugger	🟢 supported via Chrome Dev Tools integration
Diagnostics Channel	🟢 supported
DNS	🟢 supported
Errors	🟢 supported
Events	🟢 supported
File system	⚪ coming soon
Globals	🟢 supported
HTTP	⚪ not yet supported
HTTP/2	⚪ not yet supported
HTTPS	⚪ not yet supported
Inspector	🟢 supported via Chrome Dev Tools integration
Net	🟢 supported
OS	⚪ not yet supported
Path	🟢 supported
Performance hooks	🟡 partially supported
Process	🟢 supported
Query strings	🟢 supported
Stream	🟢 supported
String decoder	🟢 supported
Timers	🟢 supported
TLS/SSL	🟡 partially supported
UDP/datagram	⚪ not yet supported
URL	🟢 supported
Utilities	🟢 supported
Web Crypto API	🟢 supported
Web Streams API	🟢 supported
Zlib	🟢 supported
Unless otherwise specified, native implementations of Node.js APIs in Workers are intended to match the implementation in the Current release of Node.js ↗.

If an API you wish to use is missing and you want to suggest that Workers support it, please add a post or comment in the Node.js APIs discussions category ↗ on GitHub.

Node.js API Polyfills
Node.js APIs that are not yet supported in the Workers runtime are polyfilled via Wrangler, which uses unenv ↗. If the nodejs_compat compatibility flag is enabled, and your Worker's compatibility date is 2024-09-23 or later, Wrangler will automatically inject polyfills into your Worker's code.

Adding polyfills maximizes compatibility with existing npm packages by providing modules with mocked methods. Calling these mocked methods will either noop or will throw an error with a message like:

[unenv] <method name> is not implemented yet!

This allows you to import packages that use these Node.js modules, even if certain methods are not supported.

Enable only AsyncLocalStorage
If you need to enable only the Node.js AsyncLocalStorage API, you can enable the nodejs_als compatibility flag:

wrangler.jsonc
wrangler.toml
{
  "compatibility_flags": [
    "nodejs_als"
  ]