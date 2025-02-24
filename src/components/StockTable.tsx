"use client";

import React, { FC, useEffect, useState } from "react";

import { StockTableProps } from "@/shared/interfaces";
import { EFilter } from "@/shared/constants";

import styles from "../styles/StockTable.module.scss";
/**Компонент с таблицей по акциям с текущими данными */
export const StockTable: FC<StockTableProps> = ({ stocks }) => {
  const [filter, setFilter] = useState<EFilter>(EFilter.ALL);
  const [search, setSearch] = useState("");
  const [filteredStocks, setFilteredStocks] = useState(stocks);

  useEffect(() => {
    setFilteredStocks(
      stocks.filter(
        ({ symbol, c, o }) =>
          symbol.toLowerCase().includes(search.toLowerCase()) &&
          (filter === EFilter.ALL ||
            (filter === EFilter.UP && c > o) ||
            (filter === EFilter.DOWN && c < o))
      )
    );
  }, [filter, search, stocks]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Поиск по символу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          onChange={(e) => setFilter(e.target.value as unknown as EFilter)}
        >
          <option value={EFilter.ALL}>Все акции</option>
          <option value={EFilter.UP}>Только растущие</option>
          <option value={EFilter.DOWN}>Только падающие</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Символ</th>
            <th>Текущая цена</th>
            <th>Изменение цены</th>
          </tr>
        </thead>
        <tbody>
          {filteredStocks.map(({ symbol, c, o }) => (
            <tr key={symbol}>
              <td>{symbol}</td>
              <td>{c.toFixed(2)}</td>
              <td className={c > o ? styles.up : styles.down}>
                {o > 0 ? (((c - o) / o) * 100).toFixed(2) : "0.00"}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
