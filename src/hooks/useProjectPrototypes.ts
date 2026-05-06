import { useEffect, useState } from "react";
import {
  deletePrototype,
  getPrototype,
  updatePrototype,
  type PrototypeProps,
} from "../services/prototypes.service";

export function useProjectPrototypes(prototypeId?: string) {
  const [prototype, setPrototype] = useState<PrototypeProps | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!prototypeId) return;

    const fetch = async () => {
      try {
        setLoading(true);

        const data = await getPrototype(prototypeId);
        setPrototype(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [prototypeId]);

  const update = async (data: Partial<PrototypeProps>) => {
    if (!prototypeId) return;

    await updatePrototype(prototypeId, data);

    setPrototype(prev => (prev ? { ...prev, ...data } : prev));
  };

  const remove = async () => {
    if (!prototypeId) return;
    await deletePrototype(prototypeId);
  };

  const patch = (data: Partial<PrototypeProps>) => {
    setPrototype(prev => (prev ? { ...prev, ...data } : prev));
  };

  return {
    prototype,
    loading,
    update,
    remove,
    patch,
  };
}