import { atom, useAtom } from './jotai';

const salaryAtom = atom(100000);
const SalaryDisplay = () => {
  const [salary] = useAtom(salaryAtom);
  return <div>SalaryDisplay:{salary}</div>;
};

function App() {
  const [salary, setSalary] = useAtom(salaryAtom);

  return (
    <div>
      <div>
        <input
          type="number"
          value={salary}
          onChange={({ target: { valueAsNumber } }) =>
            setSalary(+valueAsNumber)
          }
        />
      </div>
      <div>App: {salary}</div>
      <SalaryDisplay />
    </div>
  );
}

export default App;
