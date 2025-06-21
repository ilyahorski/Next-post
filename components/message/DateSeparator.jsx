import { format, parseISO } from "date-fns";

const DateSeparator = ({ date }) => {
  return (
    <div className="no-select flex w-full justify-center">
      <div className="flex max-w-fit text-center font-normal text-[14px] my-2 dark:text-white px-2 py-1 bg-slate-800 bg-opacity-70 rounded-lg">
        {format(parseISO(date), "PPP")}
      </div>
    </div>
  );
};

export default DateSeparator;
