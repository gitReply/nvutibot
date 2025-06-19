import React from 'react';

export default function Table({ data, columns }) {
  return (
    <table border="1" cellPadding="4" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {columns.map(col => <th key={col}>{col}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            {columns.map(col => <td key={col}>{item[col]?.toString()}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
);
}
