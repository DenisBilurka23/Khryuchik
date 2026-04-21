const baseUrl = process.env.APP_URL ?? "http://127.0.0.1:3000";
const email = process.env.ADMIN_TEST_EMAIL ?? `copilot-admin-flow-${Date.now()}@example.com`;
const password = process.env.ADMIN_TEST_PASSWORD ?? "TempPass12345A";

const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({
    name: "Admin Flow Test",
    email,
    phone: "+380000000000",
    password,
  }),
});

const registerPayload = await registerResponse.json().catch(() => null);

const canReuseExistingUser =
  Boolean(process.env.ADMIN_TEST_EMAIL) &&
  registerResponse.status === 409 &&
  registerPayload?.error === "email_taken";

if (!registerResponse.ok && !canReuseExistingUser) {
  console.error(
    JSON.stringify(
      {
        step: "register",
        status: registerResponse.status,
        payload: registerPayload,
      },
      null,
      2,
    ),
  );

  process.exit(1);
}

const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`);
const csrfPayload = await csrfResponse.json();
const csrfToken = csrfPayload?.csrfToken;
const csrfCookies = csrfResponse.headers
  .getSetCookie()
  .map((cookieValue) => cookieValue.split(";")[0])
  .join("; ");

if (!csrfToken || !csrfCookies) {
  console.error(
    JSON.stringify(
      {
        step: "csrf",
        status: csrfResponse.status,
        payload: csrfPayload,
      },
      null,
      2,
    ),
  );

  process.exit(1);
}

const loginBody = new URLSearchParams({
  csrfToken,
  email,
  password,
  callbackUrl: `${baseUrl}/admin`,
});

const loginResponse = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
  method: "POST",
  headers: {
    cookie: csrfCookies,
    "content-type": "application/x-www-form-urlencoded",
  },
  body: loginBody,
  redirect: "manual",
});

const cookies = [...csrfResponse.headers.getSetCookie(), ...loginResponse.headers.getSetCookie()]
  .map((cookieValue) => cookieValue.split(";")[0])
  .join("; ");

if (!cookies) {
  console.error(
    JSON.stringify(
      {
        step: "login",
        status: loginResponse.status,
        location: loginResponse.headers.get("location"),
      },
      null,
      2,
    ),
  );

  process.exit(1);
}

const checkedPaths = [
  "/admin",
  "/admin/products",
  "/admin/products/new",
  "/admin/categories",
  "/admin/customers",
  "/admin/orders",
];

const routeStatuses = Object.fromEntries(
  await Promise.all(
    checkedPaths.map(async (path) => {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: {
          cookie: cookies,
        },
        redirect: "manual",
      });

      return [
        path,
        {
          status: response.status,
          location: response.headers.get("location"),
        },
      ];
    }),
  ),
);

console.log(
  JSON.stringify(
    {
      registerStatus: registerResponse.status,
      loginStatus: loginResponse.status,
      loginLocation: loginResponse.headers.get("location"),
      routeStatuses,
      email,
    },
    null,
    2,
  ),
);