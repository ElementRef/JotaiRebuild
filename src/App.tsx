import { atom, useAtom, useAtomValue } from './jotai';

const salaryAtom = atom(100000);
const bounsAtom = atom(10000);
const totalAtom = atom(get => get(salaryAtom) + get(bounsAtom));
const TotalDisplay = () => {
  const total = useAtomValue(totalAtom);
  return <div>TotalDisplay:{total}</div>;
};

function App() {
  const [salary, setSalary] = useAtom(salaryAtom);
  const [bouns, setBouns] = useAtom(bounsAtom);

  return (
    <>
      <div data-title="salary">
        <div>
          <input
            type="number"
            value={salary}
            onChange={({ target: { valueAsNumber } }) =>
              setSalary(+valueAsNumber)
            }
          />
        </div>
        <div>AppSalary: {salary}</div>
      </div>
      <div data-title="bouns">
        <div>
          <input
            type="number"
            value={bouns}
            onChange={({ target: { valueAsNumber } }) =>
              setBouns(+valueAsNumber)
            }
          />
        </div>
        <div>AppBouns: {bouns}</div>
      </div>
      <TotalDisplay />
    </>
  );
}

export default App;
