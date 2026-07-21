import JobList from "./JobList";

export default function Dashboard() {
  return (
    <div className="grid grid-rows-[5vh_1fr_5vh] h-screen">
      <div>{/* Simple header bar */}</div>
      <div className="grid grid-cols-[16rem_2fr_3fr]">
        <div>{/* Nav */}</div>
        <div>
          <JobList />
        </div>
        <div>{/* Details */}</div>
      </div>
      <div>{/* Simple footer bar */}</div>
    </div>
  );
}
