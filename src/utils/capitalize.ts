import { NextFunction } from "express";

export const capitalize = (capitalizeAll:boolean, camposACapitalizar?:string[]) => {

    return function(req:any, res:any, next:NextFunction) {

      if (capitalizeAll) {
        for (const campo in req.body) {
          if (typeof req.body[campo] === 'string') {
            req.body[campo] = formatString(req.body[campo]);
        }
        }
      } else if (camposACapitalizar && Array.isArray(camposACapitalizar)) {
        for (const campo of camposACapitalizar) {
          if (typeof req.body[campo] === 'string') {
            req.body[campo] = formatString(req.body[campo]);
          }
        }
      }
      next();
    };
  }

  function formatString(word:string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }