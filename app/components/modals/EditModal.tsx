"use client";

import axios from "axios";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useEditModal from "@/app/hooks/useEditModal";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";  
import { SafeListing, SafeUser } from "@/app/types";

enum STEPS {INFO = 1, IMAGES = 2, DESCRIPTION = 3, PRICE = 4,}

const EditModal = () => {
  const router = useRouter();
  const editModal = useEditModal();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.INFO);
  const [editId, setEditId] = useState("");
  console.log(editModal.listing);
  const global = useRef<SafeListing | null>(null);

  global.current = editModal.listing;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    values: {
      guestCount: global.current?.guestCount,
      bathroomCount: global.current?.bathroomCount,
      roomCount: global.current?.roomCount,
      price: global.current?.price,
      title: global.current?.title,
      description: global.current?.description,
      imageSrc: global.current?.imageSrc,
    },
  });

  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }
    axios
      .put(`/api/listings/${editModal.listing.id}`, data)
      .then(() => {
        toast.success("Listing Edited!");
        router.refresh();
        reset();
        setStep(STEPS.INFO);
        editModal.onClose();
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Edit";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Share some basics about your place"
        subtitle="What amenitis do you have?"
      />
      <Counter
        onChange={(value) => setCustomValue("guestCount", value)}
        value={guestCount}
        title="Guests"
        subtitle="How many guests do you allow?"
      />
      <hr />
      <Counter
        onChange={(value) => setCustomValue("roomCount", value)}
        value={roomCount}
        title="Rooms"
        subtitle="How many rooms do you have?"
      />
      <hr />
      <Counter
        onChange={(value) => setCustomValue("bathroomCount", value)}
        value={bathroomCount}
        title="Bathrooms"
        subtitle="How many bathrooms do you have?"
      />
    </div>
  );

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue("imageSrc", value)}
          value={imageSrc}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={true}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          //disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          //disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      //disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Airbnb your home!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.INFO ? undefined : onBack}
      onClose={() => {
        editModal.onClose();
        setStep(STEPS.INFO);
        reset();
      }}
      body={bodyContent}
    />
  );
};

export default EditModal;
