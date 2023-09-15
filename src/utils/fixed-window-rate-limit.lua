#!lua name=fwrl

redis.register_function("fwrl", function (keys, args)
        local hits = redis.call("INCR", keys[1]);

        if (hits <= 1) then
            redis.call("PEXPIRE", keys[1], args[1]);
        end

        return hits
    end
)