"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";

import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  onAction2?: (id: string) => void;

  disabled?: boolean;
  actionLabel?: string;
  label2?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  onAction2,
  label2,
  actionId = "",
  currentUser,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);
  const onEdit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction2?.(actionId);
    },
    [disabled, onAction2, actionId]
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);
  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          {data.imageSrc ? (
            <Image
              fill
              src={data.imageSrc}
              className="object-cover h-full w-full group-hover:scale-110 transition"
              alt="Listing"
            />
          ) : (
            <Image
              fill
              className="object-contain h-full w-20 group-hover:scale-110 transition"
              src="/images/Image_not_available.png"
              alt="Listing"
            />
          )}

          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">$ {price}</div>
          {!reservation && <div className="font-light">night</div>}
        </div>
        {onAction && actionLabel && (
          <div>
            {/* <Button disabled={disabled} small label={label2} onClick={onEdit}  /> */}
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={handleCancel}
            />
          </div>
        )}
        {onAction2 && label2 && (
          <div>
            <Button disabled={disabled} small label={label2} onClick={onEdit} />
            {/* <Button disabled={disabled} small label={actionLabel} onClick={handleCancel} /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
