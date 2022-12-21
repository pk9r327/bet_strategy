import logo from './logo.svg';
import './App.css';

import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([])
  const [number, setNumber] = useState(0)
  const [isRuning, setIsRuning] = useState(false)

  // useEffect(() => {
  //   console.log("useEffect 2")
  //   if (isRuning) {
  //     run()
  //     // setNumber(number + 1)
  //   }
  // })

  async function resetData(n) {
    setNumber(0)
    let newData = []
    for (let i = 0; i < n; i++) {
      newData = [...newData, {
        id: i + 1,
        bet: 0,
        results: [],
        isShowAll: false,
        betNext: 1,
        value: 0,
        max: 0,
        require: 0,
      }]
      setData(newData)
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  const result = (item) => {

    let r = item.results
    if (!item.isShowAll) {
      const max = 10;
      r = item.results.length > max ? item.results.slice(item.results.length - 10) : item.results
    }

    const last = r.length > 0 ? r[r.length - 1] : 0
    r = r.slice(0, r.length - 1)
    return (
      <div className='flex flex-wrap'>
        {item.results.length > 10 ? <span className="text-blue-600 cursor-pointer" onClick={() => {
          const newData = [...data]
          newData[item.id - 1].isShowAll = !item.isShowAll
          setData(newData)
        }}>...,</span> : null}
        {
          r.map(i => (
            <div>
              {i >= 0 ? <span className="text-green-600">+{i},</span> : <span className="text-red-600">{i},</span>}
            </div>
          ))
        }
        <div>
          {last >= 0 ? <span className="text-green-600">+{last}</span> : <span className="text-red-600">{last}</span>}
        </div>
      </div>
    )
  }

  const run = async () => {
    setIsRuning(true)
    let newData = [...data]
    for (const element of newData) {
      element.bet = element.betNext;
      if (element.require + element.value < element.bet) {
        element.require = element.bet - element.value;
      }
      element.value -= element.bet;
      element.max = Math.max(element.max, element.bet);
      if (Math.random() < 0.5) {
        element.results.push(element.bet);
        element.value += element.bet * 2;

        element.betNext = 1;
      } else {
        element.results.push(-element.bet);

        element.betNext = element.bet * 2;
      }
      const newd = [...newData]
      setData(newd);
      await new Promise(resolve => setTimeout(resolve, 0));
    };
    setNumber(number + 1)
    await new Promise(resolve => setTimeout(resolve, 0));
    setIsRuning(false)
  }

  useEffect(() => {
    resetData(10)
  }, [])

  useEffect(() => {
    if (isRuning) {
    }
  }, [isRuning])

  return (
    <div className="mt-4 min-w-min mx-3">
      <div className='flex'>
        <input id='number' className="border border-gray-300 rounded-md shadow-sm py-2 px-4 flex flex-1 mr-3" type="number" placeholder="Số lượng" defaultValue="10" />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32" onClick={async () => {
          const n = document.getElementById('number').value
          await resetData(n)
        }}>
          Đặt lại
        </button>
      </div>


      <table className="table-fixed w-full my-3 border">
        <thead className="border-b">
          <tr>
            <th className="py-4 w-12">STT</th>
            <th className="w-20">Tổng lời</th>
            <th className="w-36">Ván cuối</th>
            <th className="w-20">Số cược tiếp theo</th>
            <th className="w-20">Số cược lớn nhất</th>
            <th className="w-20">Số vốn yêu cầu</th>
          </tr>
        </thead>
        <tbody className="">
          {
            data.map(item => (
              <tr className="border-b text-center" key={item.id}>
                <td className="py-2">{item.id}</td>
                <td className="">{item.value.toLocaleString()}</td>
                <td className="flex">{result(item)}</td>
                <td className="text-yellow-600">{item.betNext}</td>
                <td className="">{item.max.toLocaleString()}</td>
                <td className="">{item.require.toLocaleString()}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <button className="mr-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        disabled={isRuning}
        onClick={async () => {
          await run()
        }}>
        Chạy 1 ván
      </button>
      <button className="mr-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        disabled={isRuning}
        onClick={async () => {
          const n = document.getElementById('numberRun').value
          for (let i = 0; i < n; i++) {
            await run()
          }
        }}>
        Chạy
      </button>
      <input id='numberRun' className="mr-3 border border-gray-300 rounded-md shadow-sm py-2 px-4" type="number" placeholder="Số lần chạy" defaultValue={100000} />

      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3" onClick={async () => {
        setIsRuning(true);
      }}>
        Chạy tự động
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={
          () => {
            setIsRuning(false)
          }
        }>
        Dừng
      </button>
      <div className="mt-3">
        <div>
          <span>Số ván cược: </span>
          <span className="text-blue-600">{number}</span>
        </div>
        <div>
          <span>Tổng lời trung bình so với vốn ban đầu: </span>
          <span className="text-green-600">{(data.reduce((a, b) => a + b.value, 0) / data.length).toFixed(0).toLocaleString()}</span>
        </div>
        <div>
          <span>Tỉ lệ vốn yêu cầu vượt tổng lời: </span>
          <span className="text-red-600">{data.filter(i => i.value < i.require).length}</span>
          <span> / </span>
          <span className="text-green-600">{data.length}</span>
        </div>
        <div>
          <span>Tỉ lệ vốn yêu cầu vượt 100,000 tiền cược ban đâu (có 100 triệu, bắt đầu từ 1 nghìn và vỡ chiến thuật): </span>
          <span className="text-red-600">{data.filter(i => i.value < i.require && i.require > 100000).length}</span>
          <span> / </span>
          <span className="text-green-600">{data.length}</span>
        </div>
        <div>
          <span>Tỉ lệ vốn yêu cầu vượt 10,000,000 tiền cược ban đâu (100 triệu quá ít? thử 10 tỷ luôn xem sao): </span>
          <span className="text-red-600">{data.filter(i => i.value < i.require && i.require > 10000000).length}</span>
          <span> / </span>
          <span className="text-green-600">{data.length}</span>
        </div>
        <div>
          <span>Vốn yêu cầu thấp nhất, lớn nhất: </span>
          <span className="">{Math.min(...data.map(i => i.require)).toLocaleString()}</span>
          <span> - </span>
          <span className="">{Math.max(...data.map(i => i.require)).toLocaleString()}</span>
        </div>
      </div>
    </div >

  );
}

export default App;
