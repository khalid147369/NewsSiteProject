import React from "react";
import { Button, Typography } from "@material-tailwind/react";

export function PanelPagination({
  onChangePageToNext,
  onChangePageToBack,
  totalPages,
}: {
  onChangePageToNext: () => void;
  onChangePageToBack: () => void;
  totalPages?: number;
  currentPage?: number;
}) {
  const [active, setActive] = React.useState(1);
  const next = () => {
    if (active === totalPages) return;
    onChangePageToNext();
    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    onChangePageToBack();
    setActive(active - 1);
  };
  return (
    <div className="flex items-center gap-8 justify-between mb-5">
      <Button
        size="sm"
        variant="outlined"
        onClick={prev}
        disabled={active === 1}
        className="bg-gray-800 rounded px-4 text-white"
      >
        Back
      </Button>
      <Typography color="gray" className="font-normal">
        Page <strong className="text-gray-900">{active}</strong> of
        <strong className="text-gray-900">{totalPages}</strong>
      </Typography>
      <Button
        size="sm"
        variant="outlined"
        onClick={next}
        disabled={active === totalPages}
        className="bg-gray-800 rounded px-4 text-white"
      >
        Next
        {/* <ArrowRightIcon strokeWidth={2} className="h-4 w-4" /> */}
      </Button>
    </div>
  );
}
