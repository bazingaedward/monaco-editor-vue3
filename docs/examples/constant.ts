export const tsString = `
import { createApp } from 'vue';
import App from './App.vue';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// @ts-ignore
self.MonacoEnvironment = {
  // @ts-ignore
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

createApp(App).mount('#app');

`;

export const jsonString = `
{
    "user": {
      "id": 12345,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "isActive": true,
      "roles": ["admin", "user"],
      "profile": {
        "age": 30,
        "address": {
          "street": "123 Main St",
          "city": "Anytown",
          "state": "CA",
          "postalCode": "12345"
        },
        "phoneNumbers": [
          {
            "type": "home",
            "number": "555-1234"
          },
          {
            "type": "work",
            "number": "555-5678"
          }
        ]
      },
      "preferences": {
        "newsletter": true,
        "notifications": {
          "email": true,
          "sms": false
        }
      },
      "createdAt": "2023-05-20T12:34:56Z",
      "lastLogin": "2024-05-20T08:30:00Z"
    }
  }
`;

export const cssString = `
/* 全局样式 */
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

h1, h2, h3 {
  color: #333;
}

p {
  color: #666;
  margin-bottom: 1em;
}

/* 类选择器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
`;

export const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample HTML File</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>

<header id="main-header">
  <h1>Welcome to My Website</h1>
  <nav>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Services</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
</header>

<div class="container">
  <section id="main-content">
    <h2>About Us</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet velit vel massa fringilla hendrerit.</p>
  </section>

  <section id="services">
    <h2>Our Services</h2>
    <ul>
      <li>Web Design</li>
      <li>Graphic Design</li>
      <li>SEO</li>
    </ul>
  </section>
</div>

<footer id="main-footer">
  <p>&copy; 2024 My Website. All Rights Reserved.</p>
</footer>

</body>
</html>
`;

export const sqlString = `
SELECT
    c.customer_id,
    c.customer_name,
    c.customer_email,
    COUNT(o.order_id) AS total_orders,
    SUM(o.total_amount) AS total_amount_spent,
    AVG(order_item_summary.average_item_price) AS average_item_price
FROM
    customers c
JOIN
    orders o ON c.customer_id = o.customer_id
JOIN
    (
        SELECT
            oi.order_id,
            AVG(oi.price) AS average_item_price
        FROM
            order_items oi
        GROUP BY
            oi.order_id
    ) AS order_item_summary ON o.order_id = order_item_summary.order_id
WHERE
    o.order_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY
    c.customer_id, c.customer_name, c.customer_email
HAVING
    SUM(o.total_amount) > 1000
ORDER BY
    total_amount_spent DESC;

`;

export const diff = 'hello';
