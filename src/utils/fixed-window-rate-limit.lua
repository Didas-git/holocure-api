#!lua name=fwrl

redis.register_function("fwrl", function (keys, args)
        local hits = redis.call("INCR", keys[1]);
        local expiresIn = redis.call("PTTL", keys[1]);

        if (expiresIn <= 0) then
            redis.call("PEXPIRE", keys[1], args[1]);
        end

        return hits
    end
)